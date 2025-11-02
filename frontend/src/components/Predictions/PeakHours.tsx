// src/components/Predictions/PeakHours.tsx
import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/order';
import { TrendingUp, Clock, Users, AlertCircle } from 'lucide-react';

interface PeakHours {
  peak_hours: string[];
  predictions?: any[];
  summary?: any;
  error?: string;
  fallback_used?: boolean;
}

const PeakHours: React.FC = () => {
  const [peakHours, setPeakHours] = useState<PeakHours | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPeakHours = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await ordersAPI.getPeakHours();
        setPeakHours(data);
        
        if (data.error) {
          setError(`ML System: ${data.error}`);
        }
      } catch (err: any) {
        console.error('Error fetching peak hours:', err);
        setError('Failed to load peak hours data');
        // Fallback data
        setPeakHours({
          peak_hours: ['11:00-13:00', '17:00-19:00'],
          fallback_used: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPeakHours();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-orange-500">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-orange-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-orange-500">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-6 w-6 text-orange-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}
      
      {peakHours?.fallback_used && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm text-yellow-700">Using fallback data</span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Busiest times based on order volume predictions
        </p>
        
        {peakHours && peakHours.peak_hours && peakHours.peak_hours.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-orange-600">
              <Users className="h-4 w-4 mr-2" />
              Peak Times Today:
            </div>
            {peakHours.peak_hours.map((time, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <Clock className="h-3 w-3 mr-2 text-orange-500" />
                {time}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No peak hours predicted for today</p>
        )}

        {/* Debug info */}
        {peakHours?.summary && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <div>Predicted: {peakHours.summary.total_hours_predicted} hours</div>
            <div>Found: {peakHours.summary.peak_hours_count} peak periods</div>
          </div>
        )}
      </div>

      {/* Simple visualization */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Today's Pattern</h4>
        <div className="flex justify-between text-xs text-gray-600">
          <span>7AM</span>
          <span className="text-red-500 font-medium">11AM-1PM</span>
          <span>2PM</span>
          <span className="text-red-500 font-medium">5PM-7PM</span>
          <span>8PM</span>
        </div>
        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="w-4/12 bg-green-400"></div>
            <div className="w-2/12 bg-red-500"></div>
            <div className="w-3/12 bg-green-400"></div>
            <div className="w-2/12 bg-red-500"></div>
            <div className="w-1/12 bg-green-400"></div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Order during off-peak hours (7-10 AM, 2-4 PM) for faster service
        </p>
      </div>
    </div>
  );
};

export default PeakHours;