using myWeather.api.Models;
using static myWeather.api.Models.ForecastModels;

namespace myWeather.api.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public WeatherService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["WeatherSettings:ApiKey"]
                      ?? throw new Exception("API Key is missing!");
        }

        public async Task<CityWeather> FetchCityWeatherAsync(string cityId)
        {
            var url = $"https://api.openweathermap.org/data/2.5/weather?id={cityId}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetFromJsonAsync<OpenWeatherResponse>(url);

            if (response == null) return new CityWeather();

            var city = new CityWeather
            {
                CityId = cityId,
                CityName = response.Name,
                Description = response.Weather[0].Description,
                Temp = response.Main.Temp,
                Humidity = response.Main.Humidity,
                WindSpeed = response.Wind.Speed
            };

            city.ComfortScore = CalculateComfortScore(city);
            return city;
        }

        public static double CalculateComfortScore(CityWeather city)
        {
            double tempPenalty = Math.Abs(city.Temp - 22) * 3;
            double humPenalty = Math.Abs(city.Humidity - 50) * 0.5;
            double windPenalty = city.WindSpeed * 2;

            double score = 100 - (tempPenalty + humPenalty + windPenalty);
            return Math.Clamp(score, 0, 100); 
        }

        public async Task<List<GraphPoint>> FetchCityForecastAsync(string cityId)
        {
            var url = $"https://api.openweathermap.org/data/2.5/forecast?id={cityId}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetFromJsonAsync<ForecastApiResponse>(url);

            if (response == null || response.List == null)
                return new List<GraphPoint>();

            return response.List.Take(8).Select(x => new GraphPoint
            {
                Time = DateTime.Parse(x.Dt_txt).ToString("h tt"),
                Temp = x.Main.Temp
            }).ToList();
        }
    }
}
