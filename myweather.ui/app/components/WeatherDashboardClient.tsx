'use client';

import { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import { CityWeather } from '../types/weather';

export default function WeatherDashboardClient({ token }: { token: string }) {
  const [data, setData] = useState<CityWeather[]>([]);
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((city) => (
          <WeatherCard key={city.cityName} city={city} />
        ))}
      </div>
    </div>
  );
}
