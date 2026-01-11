'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

interface GraphPoint {
  time: string;
  temp: number;
}

interface ForecastModalProps {
  cityId: string;
  cityName: string;
  token: string;
  onClose: () => void;
}

export default function ForecastModal({ cityId, cityName, token, onClose }: ForecastModalProps) {
  const [data, setData] = useState<GraphPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        const res = await fetch(`${baseUrl}/api/weather/forecast/${cityId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch forecast", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [cityId, token]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            24h Trend: <span className="text-blue-600">{cityName}</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
            <X size={24} className="text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Graph Area */}
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading Trend Data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ fill: '#2563eb', strokeWidth: 2 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}