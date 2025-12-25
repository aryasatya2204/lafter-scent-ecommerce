import React from 'react';

// Komponen Kartu Statistik Kecil
const StatCard = ({ title, value, subtext, color = "bg-white" }) => (
  <div className={`${color} p-6 rounded-xl shadow-sm border border-gray-100`}>
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
    <p className="text-xs text-gray-400">{subtext}</p>
  </div>
);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');
  const shopName = user.shop ? user.shop.name : 'Toko Saya';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">{shopName}</h1>
        <p className="text-gray-500">Ringkasan performa toko Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Pendapatan" value="Rp 0" subtext="Belum ada transaksi" />
        <StatCard title="Pesanan Baru" value="0" subtext="Perlu diproses" />
        <StatCard title="Total Produk" value="0" subtext="Stock tersedia" />
      </div>

      {/* Recent Orders Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <div className="text-center">
            <p className="text-gray-400 mb-2">Belum ada pesanan terbaru</p>
            <button className="text-secondary text-sm font-bold hover:underline">Kelola Produk</button>
        </div>
      </div>
    </div>
  );
}