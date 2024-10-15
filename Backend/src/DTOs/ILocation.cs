namespace Backend.DTOs;

public record Coordinates(double X, double Y);

public interface ILocation
{
    public string Name { get; set; }
    public string PositionType { get; set; }
    public Coordinates Position { get; set; }
}
