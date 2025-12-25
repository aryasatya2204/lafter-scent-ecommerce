import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data Produk saat halaman dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data.status === 'success') {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Gagal ambil produk:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Daftar Produk</h1>
        <Button onClick={() => navigate('/admin/products/create')}>
          + Tambah Produk
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">Produk</th>
              <th className="p-4 font-medium text-gray-500">Harga</th>
              <th className="p-4 font-medium text-gray-500">Stok</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center">Memuat data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada produk.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    {/* Tampilkan Gambar Utama */}
                    <img 
                      src={product.images[0] ? `http://127.0.0.1:8000${product.images[0].image_url}` : 'https://via.placeholder.com/50'} 
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover border" 
                    />
                    <span className="font-medium text-primary">{product.name}</span>
                  </td>
                  <td className="p-4">Rp {new Intl.NumberFormat('id-ID').format(product.base_price)}</td>
                  <td className="p-4">{product.variants[0]?.stock || 0} Unit</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Aktif
                    </span>
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