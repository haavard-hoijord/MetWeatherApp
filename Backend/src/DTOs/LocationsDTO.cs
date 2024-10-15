namespace Backend.DTOs;

public class LocationsDTO
{
    public FeatureDTO[] Features { get; set; }
}

public class FeatureDTO
{
    public GeometryDTO Geometry { get; set; }
    public PropertiesDTO Properties { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public string Id { get; set; }
}

public class PropertiesDTO
{
    public string collection { get; set; }
    public string shortname { get; set; }
}

public class GeometryDTO
{
    public Double[] Coordinates { get; set; }
    public string Type { get; set; }
}