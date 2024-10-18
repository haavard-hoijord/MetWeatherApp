namespace Common.Records;

public record Harbor(string Id, string Name, Position Position, string? PositionType = null)
	: Location(Name, "harbor", Position);
