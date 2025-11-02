export interface User {
  id: number;
  email: string;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  prep_time: number;
  category: string;
  image?: string; // ✅ Added
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface WaitTimePrediction {
  total_wait_time: number;
  preparation_time: number;
  queue_impact: number;
  recommendation?: string;
}

export interface PopularItem {
  id: number;
  name: string;
  score: number;
}
export interface PeakHours {
  peak_hours: string[];
  predictions?: any[];
  summary?: {
    total_hours_predicted: number;
    peak_hours_count: number;
    peak_hours_found?: string[];
    average_volume?: number;
    next_peak_hour?: string;
  };
  error?: string; // Add this
  fallback_used?: boolean; // Add this
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface MLStatus {
  status: string;
  models_loaded: {
    order_volume_predictor: boolean;
    wait_time_estimator: boolean;
    popularity_analyzer: boolean;
  };
  training_data: {
    total_orders: number;
    data_period: string;
    last_training: string;
  };
}