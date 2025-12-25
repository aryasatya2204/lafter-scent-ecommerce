import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function IncomingOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/shop'); // Panggil API Penjual
        if (response.data.status === 'success') {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Gagal ambil order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper warna status badge
  const getStatusColor = (status) => {
    switch(status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-primary mb-6">Pesanan Masuk</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">Invoice</th>
              <th className="p-4 font-medium text-gray-500">Pembeli</th>
              <th className="p-4 font-medium text-gray-500">Barang</th>
              <th className="p-4 font-medium text-gray-500">Total</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center">Memuat data...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">Belum ada pesanan masuk.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{order.invoice_number}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-700">{order.user?.name}</div>
                    <div className="text-xs text-gray-400">via {order.shipping_courier?.toUpperCase()}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {order.items[0]?.product_name_snapshot}
                    {order.items.length > 1 && <span className="text-xs text-gray-400"> +{order.items.length - 1} lainnya</span>}
                  </td>
                  <td className="p-4 font-bold text-primary">
                    Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
    onClick={() => navigate(`/admin/orders/${order.id}`)} // <--- TAMBAHKAN INI
    className="text-secondary hover:underline text-sm font-bold"
>
    Detail
</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}