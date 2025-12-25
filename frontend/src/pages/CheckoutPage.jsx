import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil data yang dikirim dari Product Detail
  const { product, quantity, variantId } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [courier, setCourier] = useState('jne');
  const [service, setService] = useState('REG');
  const [shippingCost, setShippingCost] = useState(15000); // Default dummy ongkir
  
  const [address, setAddress] = useState({
    province: '',
    city: '',
    detail: '',
    phone: '',
    note: ''
  });

  // 1. Load Script Midtrans Snap saat halaman dibuka
  useEffect(() => {
    // Redirect jika user akses halaman ini langsung tanpa pilih produk
    if (!product) {
        alert("Silakan pilih produk terlebih dahulu.");
        navigate('/');
        return;
    }

    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY; // Dari .env

    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [product, navigate]);

  // Simulasi Hitung Ongkir (Nanti diganti API RajaOngkir Real)
  const handleCourierChange = (e) => {
      const val = e.target.value;
      setCourier(val);
      if(val === 'jne') setShippingCost(15000);
      if(val === 'tiki') setShippingCost(12000);
      if(val === 'pos') setShippingCost(10000);
  };

  // Total Bayar
  const grandTotal = (product?.base_price * quantity) + shippingCost;

  // 2. LOGIC PEMBAYARAN UTAMA
  const handlePayment = async () => {
    // Validasi Form Sederhana
    if (!address.province || !address.city || !address.detail) {
        alert("Mohon lengkapi alamat pengiriman.");
        return;
    }

    setIsLoading(true);

    try {
        // A. Minta Snap Token ke Backend
        const payload = {
            product_variant_id: variantId || product.variants[0].id, // Default varian pertama
            quantity: quantity,
            shipping_courier: courier,
            shipping_service: service,
            shipping_cost: shippingCost,
            shipping_address: {
                province: address.province,
                city: address.city,
                detail: address.detail,
                phone: address.phone
            },
            note: address.note
        };

        const response = await api.post('/orders', payload);
        const { snap_token } = response.data.data;

        // B. Munculkan Popup Midtrans
        if (window.snap) {
            window.snap.pay(snap_token, {
                onSuccess: function(result) {
                    alert("Pembayaran Berhasil!");
                    navigate('/admin/orders'); // Nanti kita buat halaman History
                },
                onPending: function(result) {
                    alert("Menunggu Pembayaran...");
                    navigate('/admin/orders');
                },
                onError: function(result) {
                    alert("Pembayaran Gagal!");
                    console.error(result);
                },
                onClose: function() {
                    alert('Anda menutup popup tanpa menyelesaikan pembayaran');
                }
            });
        }

    } catch (error) {
        console.error("Checkout Error:", error);
        alert(error.response?.data?.message || "Gagal memproses pesanan.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: FORM ALAMAT */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold font-serif mb-6 text-primary">Informasi Pengiriman</h2>
            
            <div className="space-y-4">
                <Input 
                    label="Nomor Telepon" 
                    value={address.phone}
                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                    placeholder="Contoh: 08123456789"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Provinsi" 
                        value={address.province}
                        onChange={(e) => setAddress({...address, province: e.target.value})}
                    />
                    <Input 
                        label="Kota/Kabupaten" 
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                    <textarea 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        rows="3"
                        placeholder="Nama Jalan, No Rumah, RT/RW, Kecamatan"
                        value={address.detail}
                        onChange={(e) => setAddress({...address, detail: e.target.value})}
                    ></textarea>
                </div>
                
                {/* PILIH KURIR */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Kurir Pengiriman</label>
                    <select 
                        value={courier}
                        onChange={handleCourierChange}
                        className="w-full p-3 border rounded-lg bg-white"
                    >
                        <option value="jne">JNE (Rp 15.000)</option>
                        <option value="tiki">TIKI (Rp 12.000)</option>
                        <option value="pos">POS Indonesia (Rp 10.000)</option>
                    </select>
                </div>
            </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN ORDER */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold font-serif mb-6 text-primary">Ringkasan Pesanan</h2>
            
            <div className="flex gap-4 mb-6 border-b pb-6">
                <img 
                    src={product.images[0] ? `http://127.0.0.1:8000${product.images[0].image_url}` : ''} 
                    className="w-20 h-20 object-cover rounded border"
                />
                <div>
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{quantity} Barang x Rp {product.base_price}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Total Harga Barang</span>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(product.base_price * quantity)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim ({courier.toUpperCase()})</span>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(shippingCost)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-primary">
                    <span>Total Bayar</span>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(grandTotal)}</span>
                </div>
            </div>

            <Button fullWidth onClick={handlePayment} isLoading={isLoading}>
                Bayar Sekarang
            </Button>
            <p className="text-xs text-center text-gray-400 mt-4">
                Pembayaran diamankan oleh Midtrans
            </p>
        </div>

      </div>
    </div>
  );
}