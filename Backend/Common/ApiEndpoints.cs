namespace Common;

public interface IApiEndpoint
{
	string EndpointPath { get; }
}

public class TidalWaterApiEndpoint : IApiEndpoint
{
	public string EndpointPath => "tidalwater/1.1/";
}

public class ForecastApiEndpoint : IApiEndpoint
{
	public string EndpointPath => "locationforecast/2.0/";
}
