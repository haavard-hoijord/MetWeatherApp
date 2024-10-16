namespace Backend;

public interface IApiEndpoint
{
    string BaseUrl { get; }
}

public class TidalWaterApiEndpoint : IApiEndpoint
{
    public string BaseUrl => "tidalwater/1.1/";
}

