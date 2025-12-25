import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import konfigurasi Axios kita
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Tembak API Backend
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      // 2. Jika Sukses
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Simpan Token di LocalStorage (Kunci akses masuk)
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Redirect berdasarkan Role
        if (user.role === 'super_admin') {
          // navigate('/admin/dashboard'); // Belum kita buat
          alert("Login Super Admin Berhasil!");
        } else {
          navigate('/'); // Ke Home untuk Customer
        }
      }
    } catch (error) {
      // 3. Handle Error dari Backend (401/422/500)
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Terjadi kesalahan pada login.');
      } else {
        setErrorMsg('Gagal terhubung ke server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-accent">
      {/* BAGIAN KIRI: Visual Image (Hanya tampil di Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center relative overflow-hidden">
        {/* Placeholder Image - Ganti URL ini dengan foto parfum asli nanti */}
        <img 
          src="https://images.unsplash.com/photo-1595425970377-c97036c84b65?q=80&w=2500&auto=format&fit=crop" 
          alt="Luxury Perfume" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center p-10">
          <h2 className="text-4xl text-white font-serif font-bold mb-4">L'After Scent</h2>
          <p className="text-gray-300 font-sans tracking-widest text-sm uppercase">Discover Your Signature Essence</p>
        </div>
      </div>

      {/* BAGIAN KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-primary mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Masuk untuk melanjutkan belanja</p>
          </div>

          {/* Alert Error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-sm text-gray-500">
                <input type="checkbox" className="mr-2 rounded text-secondary focus:ring-secondary" />
                Ingat Saya
              </label>
              <a href="#" className="text-sm text-secondary hover:underline">Lupa Password?</a>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a 
                href="/register" 
                className="text-primary font-bold hover:text-secondary transition-colors"
                onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}