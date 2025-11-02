import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Shield, Clock } from "lucide-react";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51SP3ze2XioV9UjoaKIsvdofIlNIdqnJwfpvnf6pDkpKiRZOBgg5kqdqOKT8Dj7vgdAbr75t6DQGQ1Z3jhSsY6xk800fUN71n20";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      <div className="flex justify-center space-x-3 text-sm text-gray-600 mt-2">
        <span className="flex items-center">
          <Shield className="h-4 w-4 mr-1" /> Secure Payment
        </span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" /> Encrypted Data
        </span>
      </div>
    </form>
  );
};

const Payment: React.FC = () => {
  const { getCartTotal, cartItems, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const totalAmount = getCartTotal();

  const handleSuccess = useCallback(() => {
    localStorage.setItem("lastOrder", JSON.stringify(cartItems));
    clearCart();
    navigate("/order-success", { state: { message: "Payment successful!" } });
  }, [cartItems, clearCart, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) return;

    const createIntent = async () => {
      try {
        const res = await fetch("http://localhost:8000/payment/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        });

        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment");
      }
    };

    createIntent();
  }, [cartItems, totalAmount]);

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Your cart is empty. <a href="/menu" className="text-blue-600 ml-2">Back to Menu</a>
      </div>
    );
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600 mb-4">
            Total: ${totalAmount.toFixed(2)}
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {!clientSecret ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Setting up payment...</span>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance }}
            >
              <CheckoutForm onSuccess={handleSuccess} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
