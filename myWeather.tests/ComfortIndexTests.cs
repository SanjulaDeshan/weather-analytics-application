using Xunit;
using myWeather.api.Models;
using myWeather.api.Services;

namespace myWeather.tests
{
    public class ComfortIndexTests
    {
        [Fact]
        public void CalculateScore_IdealConditions_Returns100()
        {
            // Arrange: 22°C, 50% humidity, 0 wind is your "perfect" formula
            var city = new CityWeather
            {
                Temp = 22,
                Humidity = 50,
                WindSpeed = 0
            };

            // Act
            // We can call this directly because we made it 'static'
            double score = WeatherService.CalculateComfortScore(city);

            // Assert
            Assert.Equal(100, score);
        }

        [Fact]
        public void CalculateScore_HarshConditions_ReturnsZero()
        {
            // Arrange: Extreme heat and high wind should result in 0 (clamped)
            var city = new CityWeather
            {
                Temp = 100, // Very hot
                Humidity = 50,
                WindSpeed = 50 // Hurricane
            };

            // Act
            double score = WeatherService.CalculateComfortScore(city);

            // Assert
            Assert.Equal(0, score);
        }

        [Fact]
        public void CalculateScore_MixedConditions_ReturnsCorrectCalculation()
        {
            // Arrange
            // Temp 24 (+2 diff * 3 penalty = 6)
            // Humidity 60 (+10 diff * 0.5 penalty = 5)
            // Wind 5 (5 * 2 penalty = 10)
            // Total Penalty = 6 + 5 + 10 = 21
            // Expected Score = 100 - 21 = 79
            var city = new CityWeather
            {
                Temp = 24,
                Humidity = 60,
                WindSpeed = 5
            };

            // Act
            double score = WeatherService.CalculateComfortScore(city);

            // Assert
            Assert.Equal(79, score);
        }
    }
}