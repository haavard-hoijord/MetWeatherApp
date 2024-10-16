namespace Backend.DTOs;

public class LocationsDto
{
    public FeatureDto[] Features { get; set; }
}

public class FeatureDto
{
    public GeometryDto Geometry { get; set; }
    public PropertiesDto Properties { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public string Id { get; set; }
}

public class PropertiesDto
{
    public string Collection { get; set; }
    public string Shortname { get; set; }
}

public class GeometryDto
{
    public double[] Coordinates { get; set; }
    public string Type { get; set; }
}