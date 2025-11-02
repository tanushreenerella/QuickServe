import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { ordersAPI } from '../../services/order';
import { Clock, AlertCircle } from 'lucide-react';

const WaitTime: React.FC = () => {
  const { cartItems } = useCart();
  const [waitTime, setWaitTime] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWaitTime = async () => {
      if (cartItems.length === 0) {
        setWaitTime(null);
        return;
      }

      setLoading(true);
      try {
        const data = await ordersAPI.getWaitTimePrediction(cartItems);
        console.log("Wait Time API Response:", data);
        setWaitTime(data);
      } catch (error) {
        console.error('Error fetching wait time:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitTime();
  }, [cartItems]);

  if (!waitTime && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-blue-500">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-blue-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Estimated Wait Time</h3>
        </div>
        <p className="text-gray-600">Add items to cart to see estimated wait time</p>
      </div>
    );
  }

  const predicted = waitTime?.predicted_wait_minutes || 0;
  const prep = waitTime?.breakdown?.preparation_time || 0;
  const queue = waitTime?.breakdown?.queue_impact || 0;
  const recommendation = waitTime?.recommendation;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-blue-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Estimated Wait Time</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {predicted} minutes
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Preparation: {prep} min</div>
            <div>Queue impact: {queue} min</div>
          </div>
          
          {recommendation && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg flex items-start">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-yellow-700">{recommendation}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WaitTime;
