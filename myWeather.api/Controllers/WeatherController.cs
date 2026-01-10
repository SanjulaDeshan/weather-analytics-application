using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using myWeather.api.Models;
using myWeather.api.Services;
using System.Text.Json;

namespace myWeather.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly WeatherService _weatherService;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "WeatherData";

        public WeatherController(WeatherService weatherService, IMemoryCache cache)
        {
            _weatherService = weatherService;
            _cache = cache;
        }

        [HttpGet]
        public async Task<IActionResult> GetWeather()
        {
            if (!_cache.TryGetValue(CacheKey, out List<CityWeather> weatherList))
            {
                // 1. Get the path to the JSON file
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "cities.json");

                // 2. Read and Parse the file
                var jsonData = await System.IO.File.ReadAllTextAsync(filePath);
                var wrapper = JsonSerializer.Deserialize<CityDataWrapper>(jsonData);
                var cities = wrapper?.List;

                if (cities == null || cities.Count == 0)
                    return BadRequest("No cities found in cities.json");

                if (cities == null || cities.Count < 10)
                    return BadRequest("Minimum 10 cities required in cities.json");

                // 3. Fetch data for each city code
                weatherList = new List<CityWeather>();
                foreach (var city in cities.Take(15)) // Taking first 15 as an example
                {
                    var data = await _weatherService.FetchCityWeatherAsync(city.CityCode);
                    weatherList.Add(data);
                }

                // 4. Rank by Comfort Score
                weatherList = weatherList.OrderByDescending(c => c.ComfortScore).ToList();
                for (int i = 0; i < weatherList.Count; i++) weatherList[i].Rank = i + 1;

                // 5. Cache for 5 minutes
                _cache.Set(CacheKey, weatherList, TimeSpan.FromMinutes(5));
                return Ok(new { data = weatherList, status = "MISS" });
            }

            return Ok(new { data = weatherList, status = "HIT" });
        }
    }
}
