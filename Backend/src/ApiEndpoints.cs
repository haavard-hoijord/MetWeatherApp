namespace Backend;

public interface IApiEndpoint
{
    string EndpointPath { get; }
}

public class TidalWaterApiEndpoint : IApiEndpoint
{
    public string EndpointPath => "tidalwater/1.1/";
}

