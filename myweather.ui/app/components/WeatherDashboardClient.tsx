'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun, Search, ArrowUpDown } from "lucide-react";
import WeatherCard from './WeatherCard';
import { CityWeather } from '../types/weather';
import ForecastModal from './ForecastModal';

export default function WeatherDashboardClient({ token }: { token: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CityWeather[]>([]);
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "comfort" | "temp">("rank");

  const [selectedCity, setSelectedCity] = useState<{ id: string, name: string } | null>(null);

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

  const processedData = useMemo(() => {
    let filtered = data.filter(city => 
      city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "rank") return a.rank - b.rank; // Ascending (1 is best)
      if (sortBy === "comfort") return b.comfortScore - a.comfortScore; // Descending (High score is best)
      if (sortBy === "temp") return b.temp - a.temp; // Descending (Hot first)
      return 0;
    });
  }, [data, searchTerm, sortBy]);

  if (loading) return <div className="p-8 text-center">Loading Weather Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 transition-colors gap-4">
        
        {/* Title & Cache Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Weather Analytics</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              cacheStatus === 'HIT' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            }`}>
              {cacheStatus || 'Checking...'}
          </span>
        </div>

        {/* Controls: Search, Sort, Theme */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-40 pl-9 pr-8 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white"
            >
              <option value="rank">By Rank</option>
              <option value="comfort">By Comfort</option>
              <option value="temp">By Temperature</option>
            </select>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:ring-2 ring-blue-400 transition-all ml-auto sm:ml-0"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Grid Displaying Processed Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedData.map((city) => (
          <WeatherCard 
            key={city.cityName} 
            city={city} 
            onSelect={() => setSelectedCity({ id: city.cityId, name: city.cityName })} 
          />
        ))}
      </div>

      {/* Render Modal if city is selected */}
      {selectedCity && (
        <ForecastModal 
          cityId={selectedCity.id} 
          cityName={selectedCity.name} 
          token={token} 
          onClose={() => setSelectedCity(null)} 
        />
      )}
    </div>
  );
}
