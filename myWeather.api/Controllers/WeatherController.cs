using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using myWeather.api.Models;
using myWeather.api.Services;
using System.Text.Json;

namespace myWeather.api.Controllers
{
    [Authorize]
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
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "cities.json");

                var jsonData = await System.IO.File.ReadAllTextAsync(filePath);
                var wrapper = JsonSerializer.Deserialize<CityDataWrapper>(jsonData);
                var cities = wrapper?.List;

                if (cities == null || cities.Count == 0)
                    return BadRequest("No cities found in cities.json");

                if (cities == null || cities.Count < 10)
                    return BadRequest("Minimum 10 cities required in cities.json");

                weatherList = new List<CityWeather>();
                foreach (var city in cities.Take(15))
                {
                    var data = await _weatherService.FetchCityWeatherAsync(city.CityCode);
                    weatherList.Add(data);
                }

                weatherList = weatherList.OrderByDescending(c => c.ComfortScore).ToList();
                for (int i = 0; i < weatherList.Count; i++) weatherList[i].Rank = i + 1;

                _cache.Set(CacheKey, weatherList, TimeSpan.FromMinutes(5));
                return Ok(new { data = weatherList, status = "MISS" });
            }

            return Ok(new { data = weatherList, status = "HIT" });
        }
    }
}
