namespace myWeather.api.Models
{
    public class CityWeather
    {
        public string CityId { get; set; } = string.Empty;
        public string CityName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Temp { get; set; }
        public double Humidity { get; set; }
        public double WindSpeed { get; set; }
        public double ComfortScore { get; set; }
        public int Rank { get; set; }
    }
}
