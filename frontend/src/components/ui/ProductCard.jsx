import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Format Harga ke Rupiah
  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Ambil gambar pertama atau placeholder
  const imageUrl = product.images[0] 
    ? `http://127.0.0.1:8000${product.images[0].image_url}`
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div 
        onClick={() => navigate(`/product/${product.slug}`)}
        className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Badge Toko */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600">
            {product.shop?.name || 'Official Store'}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4">
        <h3 className="text-lg font-serif font-bold text-primary truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">{product.description}</p>
        
        <div className="flex justify-between items-center mt-2">
            <span className="text-secondary font-bold text-lg">
                {formatRupiah(product.base_price)}
            </span>
            <span className="text-xs text-gray-400">
                Stok: {product.variants[0]?.stock || 0}
            </span>
        </div>
      </div>
    </div>
  );
}