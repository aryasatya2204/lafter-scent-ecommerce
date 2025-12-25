import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lazy Init State User (Code Best Practice Anda)
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fetch Public Products
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await api.get('/public/products');
            if(response.data.status === 'success') {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-accent">
      {/* 1. HERO SECTION (Banner Atas) */}
      <div className="bg-primary text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-serif font-bold mb-4">L'After Scent</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Temukan esensi kemewahan dalam setiap tetes. E-Commerce parfum premium nomor #1 di Indonesia.
        </p>
        
        {/* Tombol Aksi (Tergantung Login) */}
        {!user ? (
            <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/login')}>Masuk</Button>
                <button onClick={() => navigate('/register')} className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-primary transition">
                    Daftar
                </button>
            </div>
        ) : (
            <div className="flex gap-4 justify-center">
                {user.shop ? (
                    <Button onClick={() => navigate('/admin/dashboard')}>Dashboard Toko</Button>
                ) : (
                    <Button onClick={() => navigate('/open-shop')}>Buka Toko</Button>
                )}
            </div>
        )}
      </div>

      {/* 2. PRODUCT GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Koleksi Terbaru</h2>
        
        {isLoading ? (
            <p className="text-center text-gray-500">Memuat koleksi...</p>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-gray-400 text-lg">Belum ada produk yang tersedia.</p>
                {user?.shop && (
                    <button onClick={() => navigate('/admin/products/create')} className="text-secondary hover:underline mt-2">
                        Tambah Produk Pertama Anda
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}