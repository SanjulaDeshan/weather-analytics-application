'use client';

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import WeatherCard from './WeatherCard';
import { CityWeather } from '../types/weather';

export default function WeatherDashboardClient({ token }: { token: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CityWeather[]>([]);
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        const response = await fetch(`${baseUrl}/api/weather`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const json = await response.json();
        setData(json.data);
        setCacheStatus(json.status);
      } catch (err: any) {
        setError(err.message || "Failed to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading Weather Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Local Weather Analytics</h1>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:ring-2 ring-blue-400 transition-all"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <div className="flex items-center gap-2 border-l dark:border-slate-700 pl-4">
            <span className="text-sm font-medium text-gray-500">Cache Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              cacheStatus === 'HIT' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
              {cacheStatus || 'Checking...'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((city) => (
          <WeatherCard key={city.cityName} city={city} />
        ))}
      </div>

    </div>
  );
}
