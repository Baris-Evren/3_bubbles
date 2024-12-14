import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { CustomerInfo } from '../types';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    address: '',
    companyName: '',
    phone: '',
    email: '',
    taxOrIdNumber: '',
    companyTitle: '',
    taxOffice: ''
  });

  const exchangeRate = 32;
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.priceUSD * exchangeRate * item.quantity), 0
  );
  const tax = items.reduce((sum, item) => 
    sum + (item.product.priceUSD * exchangeRate * item.quantity * (item.product.taxRate / 100)), 0
  );
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    try {
      const orderData = {
        items,
        customerInfo,
        totalAmount: total,
        status: 'preparing',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      alert('Siparişiniz başarıyla alındı!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Sepetiniz boş</h2>
        <p className="text-gray-500 mt-2">Alışverişe devam etmek için ürünler sayfasına dönün.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sepetim</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-gray-600">₺{(item.product.priceUSD * exchangeRate).toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>KDV:</span>
                <span>₺{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Toplam:</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Müşteri Bilgileri</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <input
                type="text"
                name="fullName"
                value={customerInfo.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adres</label>
              <input
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Firma Adı</label>
              <input
                type="text"
                name="companyName"
                value={customerInfo.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vergi/TC No</label>
              <input
                type="text"
                name="taxOrIdNumber"
                value={customerInfo.taxOrIdNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Firma Ünvanı</label>
              <input
                type="text"
                name="companyTitle"
                value={customerInfo.companyTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vergi Dairesi</label>
              <input
                type="text"
                name="taxOffice"
                value={customerInfo.taxOffice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Siparişi Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}