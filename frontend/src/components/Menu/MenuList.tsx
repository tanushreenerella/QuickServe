import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ordersAPI } from '../../services/order';
import type { MenuItem as MenuItemType } from '../../types';
import MenuItem from './MenuItem';
import PopularItems from '../Predictions/PopularItems';
import WaitTime from '../Predictions/WaitTime';
import PeakHours from '../Predictions/PeakHours';
import { ShoppingCart, LogOut } from 'lucide-react';

const MenuList: React.FC = () => {
  const [menu, setMenu] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await ordersAPI.getMenu();

        // Add mock images if missing
        const menuWithImages = data.map((item) => ({
          ...item,
          image: item.image || getMockImageForCategory(item.category),
        }));
        setMenu(menuWithImages);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const getMockImageForCategory = (category: string) => {
    const imageMap: { [key: string]: string } = {
      Burgers:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      Pizza:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      Salads:
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      Drinks:
        'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop',
      Desserts:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      Sides:
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
    };
    return (
      imageMap[category] ||
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">QuickServe</h1>
                <p className="text-sm text-gray-600">
                  Smart ordering, faster service
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name || user?.email}!
              </span>

              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ✅ MENU FIRST */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Fresh & Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* ✅ PREDICTIONS BELOW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WaitTime />
          <PopularItems />
          <PeakHours />
        </div>
      </div>
    </div>
  );
};

export default MenuList;
