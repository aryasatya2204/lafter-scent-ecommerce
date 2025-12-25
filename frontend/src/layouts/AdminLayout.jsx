import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // SECURITY CHECK SEDERHANA
    // Jika user coba akses /admin tapi belum login atau belum punya toko -> Tendang ke Home
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');

    if (!token) {
        navigate('/login');
    } else if (!user.shop) {
        alert("Anda belum memiliki toko.");
        navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Kiri (Fixed) */}
      <Sidebar />

      {/* Konten Kanan (Dynamic) */}
      <div className="flex-1 ml-64 p-10 overflow-y-auto">
        {/* Outlet adalah tempat halaman anak (Dashboard, Products, dll) dirender */}
        <Outlet />
      </div>
    </div>
  );
}