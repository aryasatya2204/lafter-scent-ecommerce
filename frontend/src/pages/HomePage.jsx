import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek apakah ada data user di LocalStorage
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent text-center p-4">
      <h1 className="text-5xl font-serif text-primary mb-4 font-bold">L'After Scent</h1>
      
      {user ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
          <p className="text-gray-500 mb-2">Selamat Datang,</p>
          <h2 className="text-2xl font-bold text-primary mb-6">{user.name}</h2>
          <div className="flex gap-4 justify-center">
             <Button onClick={() => alert('Fitur Toko Segera Hadir')}>Buka Toko</Button>
             <button 
                onClick={handleLogout}
                className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
             >
                Logout
             </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
            <p className="text-lg text-gray-600">E-Commerce Parfum Premium Terlengkap</p>
            <div className="flex gap-4 justify-center mt-6">
                <Button onClick={() => navigate('/login')}>Login</Button>
                <button 
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-gray-100"
                >
                    Register
                </button>
            </div>
        </div>
      )}
    </div>
  );
}