// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import OrderSuccess from "./components/Checkout/OrderSuccess";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import MenuList from "./components/Menu/MenuList";
import Cart from "./components/Menu/Cart";
import Payment from "./components/Checkout/Payment";
import OrderSummary from "./components/Checkout/OrderSummary";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected routes */}
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <MenuList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-summary"
                element={
                  <ProtectedRoute>
                    <OrderSummary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />
              {/* Default route */}
              <Route path="/" element={<Navigate to="/menu" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
