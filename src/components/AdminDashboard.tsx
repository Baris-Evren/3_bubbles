import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Paneli</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Ürün Yönetimi</h2>
          <p className="text-gray-600">Yeni ürün ekle ve mevcut ürünleri düzenle</p>
        </Link>

        <Link
          to="/admin/orders"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Sipariş Takibi</h2>
          <p className="text-gray-600">Siparişleri görüntüle ve durumlarını güncelle</p>
        </Link>
      </div>
    </div>
  );
}