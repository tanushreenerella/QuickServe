import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const OrderSuccess: React.FC = () => {
  const [order, setOrder] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      navigate("/menu");
    }
  }, [navigate]);

  const total = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your food will be ready shortly 🍽️
        </p>

        {order.length > 0 && (
          <div className="text-left border-t border-gray-200 pt-4 mb-4">
            <h2 className="font-semibold text-gray-700 mb-2">Your Order:</h2>
            <ul className="space-y-2">
              {order.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 mt-3 pt-2 flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/menu")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
