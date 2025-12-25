import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  // Helper untuk styling link aktif vs non-aktif
  const linkClasses = ({ isActive }) =>
    `flex items-center px-6 py-4 transition-colors duration-200 ${
      isActive 
        ? 'bg-secondary text-white border-r-4 border-white' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-primary min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50 shadow-2xl">
      {/* 1. Logo Area */}
      <div className="p-8 text-center border-b border-gray-800">
        <h2 className="text-2xl font-serif font-bold text-secondary tracking-wider">L'After</h2>
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Seller Centre</span>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 py-6 flex flex-col space-y-1">
        <NavLink to="/admin/dashboard" className={linkClasses}>
          <span className="font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/products" className={linkClasses}>
          <span className="font-medium">Produk Saya</span>
        </NavLink>
        
        <NavLink to="/admin/orders" className={linkClasses}>
          <span className="font-medium">Pesanan Masuk</span>
        </NavLink>
        
        <NavLink to="/admin/settings" className={linkClasses}>
          <span className="font-medium">Pengaturan Toko</span>
        </NavLink>
      </nav>

      {/* 3. Logout Button */}
      <div className="p-6 border-t border-gray-800">
        <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 border border-gray-600 rounded text-sm text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
        >
            Keluar
        </button>
      </div>
    </div>
  );
}