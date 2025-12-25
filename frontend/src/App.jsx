import { Routes, Route } from 'react-router-dom';

// Kita akan buat halaman ini sebentar lagi
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/admin/Dashboard';
import OpenShopPage from './pages/admin/OpenShopPage';
import AdminLayout from './layouts/AdminLayout';
import ProductListPage from './pages/admin/ProductListPage';
import AddProductPage from './pages/admin/AddProductPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Admin */}
        <Route path="/open-shop" element={<OpenShopPage />} /> 
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<AddProductPage />} />
 
            {/* Nanti kita tambah ini di Sprint berikutnya: */}
            {/* <Route path="products" element={<ProductListPage />} /> */}
            {/* <Route path="orders" element={<OrderListPage />} /> */}
        </Route>
    </Routes>
  );
}

export default App;