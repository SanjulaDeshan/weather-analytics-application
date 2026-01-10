namespace myWeather.api.Models
{
    public class OpenWeatherResponse
    {
        public string Name { get; set; } = string.Empty;
        public Weather[] Weather { get; set; } = Array.Empty<Weather>();
        public MainData Main { get; set; } = new();
        public Wind Wind { get; set; } = new();
    }

    public class Weather
    {
        public string Description { get; set; } = string.Empty;
    }

    public class MainData
    {
        public double Temp { get; set; }
        public double Humidity { get; set; }
    }

    public class Wind
    {
        public double Speed { get; set; }
    }
}
