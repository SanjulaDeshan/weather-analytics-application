'use client';
import Image from "next/image";
import { useEffect, useState } from 'react';
import WeatherCard from './components/WeatherCard';
import { CityWeather } from './types/weather';

export default function Dashboard() {
  const [data, setData] = useState<CityWeather[]>([]);
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7218/api/weather');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const json = await response.json();
        setData(json.data);
        setCacheStatus(json.status);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Weather Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Weather Comfort Index</h1>
          <div className={`px-4 py-2 rounded text-white font-bold ${cacheStatus === 'HIT' ? 'bg-green-600' : 'bg-orange-500'}`}>
            Cache: {cacheStatus}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((city) => (
            <WeatherCard key={city.cityName} city={city} />
          ))}
        </div>
      </div>
    </main>
  );
}