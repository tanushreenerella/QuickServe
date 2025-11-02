import React from "react";
import { useCart } from "../../contexts/CartContext";
import type { MenuItem as MenuItemType } from "../../types";
import { Clock, Plus, Minus } from "lucide-react";

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  // Find if this item is already in the cart
  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* ✅ Item Image */}
      <div className="relative">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
          }
          alt={item.name}
          className="h-48 w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop";
          }}
        />
        {/* Optional category tag */}
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
          {item.category}
        </span>
      </div>

      {/* ✅ Item Info + Actions */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
          <span className="text-lg font-bold text-blue-600">
            ${item.price}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {item.prep_time} min
          </div>

          {/* ✅ Quantity Controls */}
          {quantity > 0 ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded-md transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
