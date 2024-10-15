namespace Backend.DTOs;

public interface ITidalWaterDTO
{
    public string Name { get; set; }
    public DateTime LastUpdated { get; set; }
    public List<ITidalValue> Values { get; set; }
}

public interface ITidalValue {
    public DateTime TimeUTC { get; set; }
    public double Surge { get; set; }
    public double Total { get; set; }
    
    public double P0 { get; set; }
    public double P25 { get; set; }
    public double P50 { get; set; }
    public double P75 { get; set; }
    public double P100 { get; set; }
}

public class TidalWaterDTO : ITidalWaterDTO
{
    public string Name { get; set; }
    public DateTime LastUpdated { get; set; }
    public List<ITidalValue> Values { get; set; }
}

public class TidalValue : ITidalValue
{
    public DateTime TimeUTC { get; set; }
    public double Surge { get; set; }
    public double Total { get; set; }
    
    public double P0 { get; set; }
    public double P25 { get; set; }
    public double P50 { get; set; }
    public double P75 { get; set; }
    public double P100 { get; set; }
}