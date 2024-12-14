import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { format } from 'date-fns';

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Order[];
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sipariş Takibi</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Sipariş #{order.id.slice(0, 8)}
                </h3>
                <p className="text-gray-600">
                  {format(order.createdAt, 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="preparing">Hazırlanıyor</option>
                <option value="ready">Hazır</option>
                <option value="shipped">Kargoya Verildi</option>
                <option value="delivered">Teslim Edildi</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Müşteri Bilgileri</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Ad Soyad:</span> {order.customerInfo.fullName}</p>
                  <p><span className="font-medium">Telefon:</span> {order.customerInfo.phone}</p>
                  <p><span className="font-medium">E-posta:</span> {order.customerInfo.email}</p>
                  <p><span className="font-medium">Adres:</span> {order.customerInfo.address}</p>
                  <p><span className="font-medium">Firma:</span> {order.customerInfo.companyName}</p>
                  <p><span className="font-medium">Vergi/TC No:</span> {order.customerInfo.taxOrIdNumber}</p>
                  <p><span className="font-medium">Vergi Dairesi:</span> {order.customerInfo.taxOffice}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Sipariş Detayları</h4>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                        <p className="text-sm text-gray-600">
                          Fiyat: ₺{(item.product.priceUSD * 32 * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-semibold">
                    Toplam: ₺{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}