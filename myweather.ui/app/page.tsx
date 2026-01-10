import { auth0 } from '../app/lib/auth0'; 
import WeatherDashboardClient from './components/WeatherDashboardClient';

export default auth0.withPageAuthRequired(async function Dashboard() {
  const { token } = await auth0.getAccessToken();

  if (!token) {
    return (
      <div className="p-8 text-center">
        <p>Session expired or Token missing.</p>
        <a href="/auth/login" className="text-blue-600 underline">Login Again</a>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-end max-w-6xl mx-auto mb-4">
        <a href="/auth/logout" className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold">
          Logout
        </a>
      </div>
      <WeatherDashboardClient token={token} />
    </main>
  );
}, { returnTo: '/' });