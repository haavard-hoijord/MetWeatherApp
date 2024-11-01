namespace Backend.Utils;

public static class GeoDistanceCalculator
{
	public static double Haversine(double lat1, double lon1, double lat2, double lon2)
	{
		const double R = 6371; // Radius of the Earth in kilometers
		var rlat1 = ToRadians(lat1); // Convert degrees to radians
		var rlat2 = ToRadians(lat2); // Convert degrees to radians
		var difflat = rlat2 - rlat1; // Radian difference (latitudes)
		var difflon = ToRadians(lon2 - lon1); // Radian difference (longitudes)

		var d =
			2
			* R
			* Math.Asin(
				Math.Sqrt(
					Math.Sin(difflat / 2) * Math.Sin(difflat / 2) + Math.Cos(rlat1) * Math.Cos(rlat2) * Math.Sin(difflon / 2) * Math.Sin(difflon / 2)
				)
			);
		return d;
	}

	private static double ToRadians(double degrees)
	{
		return degrees * (Math.PI / 180);
	}
}
