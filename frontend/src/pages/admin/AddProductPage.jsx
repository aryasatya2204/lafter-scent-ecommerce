import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: ''
  });

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TEKNIK UPLOAD FILE: Pakai FormData, bukan JSON biasa
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('description', form.description);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
      // Axios otomatis mendeteksi FormData dan mengatur Header Content-Type
      await api.post('/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert('Produk berhasil ditambahkan!');
      navigate('/admin/products'); // Kembali ke list
    } catch (error) {
      console.error(error);
      alert('Gagal upload produk. Cek console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-serif font-bold mb-6">Tambah Produk Baru</h1>
      
      <form onSubmit={handleSubmit}>
        <Input 
            label="Nama Produk" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="Ex: Parfum Black Musk"
        />
        
        <div className="grid grid-cols-2 gap-4">
            <Input 
                label="Harga (Rp)" 
                type="number"
                value={form.price} 
                onChange={(e) => setForm({...form, price: e.target.value})}
            />
            <Input 
                label="Stok Awal" 
                type="number"
                value={form.stock} 
                onChange={(e) => setForm({...form, stock: e.target.value})}
            />
        </div>

        {/* Input File Manual Custom */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Foto Produk</label>
            <input 
                type="file" 
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-yellow-600"
            />
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
            <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
            ></textarea>
        </div>

        <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>Simpan Produk</Button>
            <button 
                type="button" 
                onClick={() => navigate('/admin/products')}
                className="px-6 py-3 rounded-lg border text-gray-500 hover:bg-gray-50"
            >
                Batal
            </button>
        </div>
      </form>
    </div>
  );
}