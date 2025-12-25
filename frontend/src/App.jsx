import { Routes, Route } from 'react-router-dom';

// Kita akan buat halaman ini sebentar lagi
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/admin/Dashboard';
import OpenShopPage from './pages/admin/OpenShopPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Admin */}
        <Route path="/open-shop" element={<OpenShopPage />} /> 
        <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;