namespace myWeather.api.Models
{
    public class ForecastModels
    {
        public class ForecastApiResponse
        {
            public List<ForecastItem> List { get; set; } = new();
        }

        public class ForecastItem
        {
            public long Dt { get; set; }
            public MainData Main { get; set; } = new();
            public string Dt_txt { get; set; } = string.Empty;
        }

        public class GraphPoint
        {
            public string Time { get; set; } = string.Empty; // e.g., "12:00 PM"
            public double Temp { get; set; }
        }
    }
}
