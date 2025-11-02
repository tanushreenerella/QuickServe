// src/components/Checkout/OrderSummary.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderSummary: React.FC = () => {
  // In a real app, you would get this data from your state management or API
  const orderNumber = `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const estimatedWait = '18-25 minutes';
  const estimatedTime = new Date(Date.now() + 25 * 60000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 p-6 border-b border-green-200">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
                <p className="text-green-600">Thank you for your order</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-6">
            {/* Order Number */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Order number</p>
              <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
            </div>

            {/* Estimated Time */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estimated Ready</p>
                <p className="font-semibold text-gray-900">{estimatedTime}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estimated Wait</p>
                <p className="font-semibold text-gray-900">{estimatedWait}</p>
              </div>
            </div>

            {/* ML Predictions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Smart Queue Insights</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Current queue: 5 orders ahead of you</li>
                <li>• Kitchen is operating at optimal speed</li>
                <li>• Your order is in the preparation queue</li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📱 You'll receive an SMS when your order is ready</p>
                <p>📍 Pick up your order at the main counter</p>
                <p>⏰ We'll notify you if there are any delays</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/menu"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors"
              >
                Order Again
              </Link>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;