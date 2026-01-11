import { Cloud, Sun, Thermometer, Award } from 'lucide-react';
import { CityWeather } from '../types/weather';

export default function WeatherCard({ city }: { city: CityWeather }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{city.cityName}</h2>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
          Rank #{city.rank}
        </span>
      </div>
      <p className="text-gray-500 dark:text-slate-400 capitalize mb-4">{city.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="text-orange-500" size={20} />
          <span className="text-lg font-semibold text-slate-500 dark:text-slate-200">{city.temp}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="text-green-500" size={20} />
          <span className="text-lg font-semibold text-slate-500 dark:text-slate-200">{city.comfortScore.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}