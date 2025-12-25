import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch Detail Order
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        alert("Gagal memuat order.");
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  // Handle Update Status
  const handleUpdateStatus = async (newStatus) => {
    // Jika kirim barang, minta input resi
    let resi = null;
    if (newStatus === 'shipped') {
        resi = prompt("Masukkan Nomor Resi Pengiriman:");
        if (!resi) return; // Batal jika kosong
    }

    if (!confirm(`Ubah status pesanan menjadi ${newStatus}?`)) return;

    setProcessing(true);
    try {
        await api.patch(`/orders/${id}/status`, {
            status: newStatus,
            tracking_number: resi
        });
        alert("Status berhasil diperbarui!");
        // Refresh data manual
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert("Gagal update status.");
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <div>Memuat...</div>;
  if (!order) return <div>Order tidak ditemukan.</div>;

  // Parsing Alamat JSON
  const address = order.shipping_address_snapshot || {};

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Detail Pesanan</h1>
            <p className="text-gray-500 font-mono text-sm">#{order.invoice_number}</p>
        </div>
        <button onClick={() => navigate('/admin/orders')} className="text-gray-500 hover:text-primary">
            Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: INFO ORDER & STATUS */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Kartu Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Status Pesanan</h3>
                <div className="flex items-center gap-4 mb-6">
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.order_status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.order_status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {order.order_status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                        Payment: {order.payment_status.toUpperCase()}
                    </span>
                </div>

                {/* TOMBOL AKSI (Hanya muncul jika status sesuai) */}
                <div className="flex gap-3">
                    {order.order_status === 'pending' && (
                        <Button onClick={() => handleUpdateStatus('processing')} isLoading={processing}>
                            Proses Pesanan
                        </Button>
                    )}
                    {order.order_status === 'processing' && (
                        <Button onClick={() => handleUpdateStatus('shipped')} isLoading={processing}>
                            Kirim Barang (Input Resi)
                        </Button>
                    )}
                    {order.order_status === 'shipped' && (
                         <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded w-full">
                            Barang sedang dalam pengiriman. Menunggu konfirmasi pembeli.
                         </div>
                    )}
                </div>
            </div>

            {/* List Barang */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Item Dipesan</h3>
                <div className="divide-y">
                    {order.items.map(item => (
                        <div key={item.id} className="py-4 flex justify-between">
                            <div>
                                <p className="font-medium text-primary">{item.product_name_snapshot}</p>
                                <p className="text-sm text-gray-500">
                                    Varian: {item.variant_snapshot} | Qty: {item.qty}
                                </p>
                            </div>
                            <p className="font-bold">
                                Rp {new Intl.NumberFormat('id-ID').format(item.price_snapshot)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                    <span>Total Pembayaran</span>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                </div>
            </div>
        </div>

        {/* KOLOM KANAN: INFO PENGIRIMAN */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-700 mb-4">Info Pengiriman</h3>
            
            <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-bold">Penerima</p>
                <p className="font-medium">{order.user?.name}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-bold">Alamat</p>
                <p className="text-sm text-gray-600">
                    {address.detail}<br/>
                    {address.city}, {address.province}
                </p>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-bold">Ekspedisi</p>
                <p className="font-medium uppercase">{order.shipping_courier} - {order.shipping_service}</p>
            </div>

            {order.shipping_note && (
                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                    <p className="font-bold text-xs uppercase mb-1">Catatan / Resi:</p>
                    {order.shipping_note}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}