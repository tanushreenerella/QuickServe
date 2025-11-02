// src/components/Predictions/PopularItems.tsx
import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/order';
import type { PopularItem } from '../../types';
import { TrendingUp, Star } from 'lucide-react';

const PopularItems: React.FC = () => {
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const data = await ordersAPI.getPopularItems();
        setPopularItems(data.recommendations || []);
      } catch (error) {
        console.error('Error fetching popular items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-green-500">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Popular Now</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {popularItems.slice(0, 3).map((item, index) => (
            <div key={item.id || index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-700">{item.name}</span>
              </div>
              {item.score && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {Math.round(item.score)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularItems;