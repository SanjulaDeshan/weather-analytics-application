import { Cloud, Sun, Thermometer, Award } from 'lucide-react';
import { CityWeather } from '../types/weather';

export default function WeatherCard({ city }: { city: CityWeather }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">{city.cityName}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
          Rank #{city.rank}
        </span>
      </div>
      <p className="text-gray-500 capitalize mb-4">{city.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="text-orange-500" size={20} />
          <span className="text-lg font-semibold text-slate-500">{city.temp}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="text-green-500" size={20} />
          <span className="text-lg font-semibold text-slate-500">{city.comfortScore.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}