namespace Backend.DTOs;

public interface IHarbor: ILocation
{
    public string Id { get; set; }
    public string Type { get; set; }
}

public class Harbor : IHarbor
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } = "harbor";
    public string PositionType { get; set; }
    public Coordinates Position { get; set; }
}