import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';

export default function ProductDetailPage() {
  const { slug } = useParams(); // Ambil slug dari URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Fetch Data Detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/public/products/${slug}`);
        if (response.data.status === 'success') {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Produk tidak ditemukan", error);
        // Jika error 404, bisa redirect ke home atau tampilkan pesan
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat detail produk...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-red-500">Produk tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR SEDERHANA (TOMBOL KEMBALI) */}
      <div className="p-6 border-b sticky top-0 bg-white/80 backdrop-blur z-10">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-primary flex items-center gap-2">
            ← Kembali ke Katalog
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* BAGIAN KIRI: GAMBAR PRODUK */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
              <img 
                src={product.images[0] ? `http://127.0.0.1:8000${product.images[0].image_url}` : 'https://via.placeholder.com/500'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* BAGIAN KANAN: INFO & BELI */}
          <div className="w-full lg:w-1/2">
            {/* Nama Toko */}
            <div className="mb-4">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {product.shop?.name || 'Official Store'}
                </span>
            </div>

            <h1 className="text-4xl font-serif font-bold text-primary mb-4">{product.name}</h1>
            
            <p className="text-3xl text-secondary font-bold mb-6">
                {formatRupiah(product.base_price)}
            </p>

            <div className="prose text-gray-500 mb-8 border-b border-gray-100 pb-8">
                <p>{product.description}</p>
            </div>

            {/* Selector Jumlah & Stok */}
            <div className="mb-8">
                <p className="text-sm text-gray-500 mb-2">Jumlah Pembelian (Stok: {product.variants[0]?.stock})</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="px-4 py-2 hover:bg-gray-100 text-gray-600"
                        >-</button>
                        <span className="px-4 py-2 font-bold w-12 text-center">{qty}</span>
                        <button 
                            onClick={() => setQty(Math.min(product.variants[0]?.stock, qty + 1))}
                            className="px-4 py-2 hover:bg-gray-100 text-gray-600"
                        >+</button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button 
                    fullWidth 
                    onClick={() => alert(`Fitur Checkout untuk ${qty} item akan dibuat di Sprint berikutnya!`)}
                >
                    Beli Sekarang
                </Button>
                
                <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-gray-50 transition">
                    ❤️
                </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-400 text-center">
                Jaminan produk original 100%. Pengiriman aman ke seluruh Indonesia.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}