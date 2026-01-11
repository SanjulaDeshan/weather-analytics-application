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
The API will start on ```https://localhost:7218``` (or your configured port).

**or**

1. go to the myWeather.api
2. open the visual studio solution file (myWeather.api.sln)
3. Go to the top menu in Visual Studio: Build > Build Solution
4. Go to the top menu in Visual Studio: Click the Run All button (Green play icon)

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
5. Go to the ```http://localhost:3000/```

### Running Tests

1. The solution includes Unit Tests for the Comfort Index calculation logic using xUnit.

2. Open the solution in Visual Studio.

3. Open Test Explorer (Test > Test Explorer).

4. Click Run All.

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

### Design Decisions & Trade-offs

1. Server-Side vs. Client-Side Calculation
  * Decision: The Comfort Index is calculated on the Backend.

  * Trade-off: This increases server CPU usage slightly but ensures Consistency and Security. If logic were on the client, ranking sorting would be complex (requires fetching   all data first) and the formula would be exposed.

2. Caching Strategy
  * Implementation: IMemoryCache (In-Memory).

  * Logic: Raw API responses are cached for 5 minutes. The application checks for a cache entry before hitting the OpenWeatherMap API to avoid rate limits and reduce latency.

  * Trade-off: In-memory caching is fast and simple for a single server but does not scale across multiple instances (would require Redis for distributed caching).

3. Authentication Flow
  * Implementation: Auth0 with Authorization Code Flow.

  * Security: The frontend handles the login redirect, but the Backend validates the Access Token (JWT). Even if the UI is bypassed, the API remains secure ([Authorize] attribute).

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