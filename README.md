# Weather Analytics Application

A secure, full-stack weather dashboard that calculates a custom **Comfort Index** for cities and ranks them from *Most Comfortable* to *Least Comfortable* using live weather data.

---

## Setup Instructions

### Backend (.NET 8)

1. Navigate to the backend directory:
   ```bash
   cd myWeather.api
   ```
2. Create an appsettings.json file (see template below).

3. Ensure cities.json is located in the Data/ folder and set to Copy to Output Directory.

4. Run the application:
    ```bash
    dotnet run
    ```

### Frontend (Next.js)

1. Navigate to the frontend directory:
```bash
cd myweather.ui
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env.local file (see template below).

4. Start the development server:
```bash
npm run dev
```

### Comfort Index Formula

The Comfort Index Score is calculated on the backend:
```
Score = 100 - (|T - 22| x 4) - (|H - 50| x 0.5) - (W x 2)
```

Where:

* T = Temperature (°C)
* H = Humidity (%)
* W = Wind Speed (m/s)
* Score Range = 0–100 (Clamped)

| Factor      | Weight | Reason                                  |
| ----------- | ------ | --------------------------------------- |
| Temperature | 4      | 22°C is the human thermal neutral point |
| Humidity    | 0.5    | Ideal comfort at 50%                    |
| Wind Speed  | 2      | High wind reduces perceived comfort     |

### Cache Design
* Server-side caching using IMemoryCache.
* Duration: 5 minutes
* Key: WeatherData:```{CityName}```

Debug Status: Each response includes HIT or MISS

* Trade-offs
* Backend calculation ensures secure and consistent ranking.
* In-memory cache chosen for simplicity (Redis recommended for production scale).

### Known Limitations

* Static city list from cities.json
* Requires Auth0 Email MFA
* In-memory cache does not persist across server restarts

### Example Configuration

Backend: ```appsettings.json```
```bash
{
  "Auth0": {
    "Domain": "https://YOUR_DOMAIN.auth0.com/",
    "Audience": "https://weather-api"
  },
  "WeatherSettings": {
    "ApiKey": "YOUR_OPENWEATHERMAP_API_KEY"
  },
    "Auth0": {
        "Domain": "your domain",
        "Audience": "your Audience"
  }
}
```
Frontend:```.env.local```
```bash
AUTH0_SECRET='use-openssl-rand-hex-32'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
AUTH0_AUDIENCE='https://weather-api'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
NEXT_PUBLIC_BACKEND_API_URL='https://localhost:port_number'
```