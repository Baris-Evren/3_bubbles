import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            3D Print Shop
          </Link>
          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Admin Panel
              </Link>
            )}
            <Link to="/cart" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Sepet</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}