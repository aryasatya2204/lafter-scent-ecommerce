import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Axios instance kita
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function OpenShopPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    city_id: '153', // Default Jakarta Selatan (Dummy sementara)
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Kirim Data ke Backend
      const response = await api.post('/shops', {
        name: formData.name,
        city_id: parseInt(formData.city_id), // Pastikan Integer
        description: formData.description
      });

      if (response.data.status === 'success') {
        // 2. UPDATE LOCAL STORAGE (PENTING!)
        // Kita ambil data user lama, lalu selipkan data shop baru
        const oldUserData = JSON.parse(localStorage.getItem('user_data'));
        const newUserData = { ...oldUserData, shop: response.data.data };
        
        localStorage.setItem('user_data', JSON.stringify(newUserData));

        // 3. Redirect ke Dashboard Toko
        alert('Toko berhasil dibuat! Selamat berjualan.');
        navigate('/admin/dashboard');
      }

    } catch (error) {
      console.error("Open Shop Error:", error);
      if (error.response && error.response.data) {
        // Tampilkan error validasi (misal nama toko kembar)
        const msg = error.response.data.message || 'Gagal membuat toko.';
        const valErrors = error.response.data.errors;
        
        if (valErrors) {
            // Gabungkan semua error jadi satu string
            setErrorMsg(Object.values(valErrors).flat().join(', '));
        } else {
            setErrorMsg(msg);
        }
      } else {
        setErrorMsg('Terjadi kesalahan jaringan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-primary mb-2">Mulai Bisnis Anda</h1>
          <p className="text-gray-500 text-sm">Lengkapi data toko untuk mulai berjualan</p>
        </div>

        {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input Nama Toko */}
          <Input 
            label="Nama Toko"
            placeholder="Contoh: L'After Official Store"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          {/* Dropdown Kota (Sementara Static) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1 font-sans">
                Kota Asal Pengiriman
            </label>
            <select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            >
                <option value="153">Jakarta Selatan</option>
                <option value="151">Jakarta Barat</option>
                <option value="23">Bandung</option>
                <option value="444">Surabaya</option>
                <option value="255">Medan</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">*Integrasi RajaOngkir Full akan menyusul</p>
          </div>

          {/* Deskripsi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1 font-sans">
                Deskripsi Singkat
            </label>
            <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ceritakan tentang toko Anda..."
            ></textarea>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Buka Toko Sekarang
          </Button>
          
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-4 text-sm text-gray-500 hover:text-primary"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}