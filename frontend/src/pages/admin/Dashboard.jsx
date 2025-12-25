import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-serif mb-4">Seller Dashboard</h1>
      <p className="mb-4">Kelola produk dan pesanan Anda di sini.</p>
      <Button onClick={() => navigate('/')}>Kembali ke Home</Button>
    </div>
  );
}