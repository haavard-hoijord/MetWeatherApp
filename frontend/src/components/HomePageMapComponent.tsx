import {
  MapMouseEvent,
  useMap,
  Map,
  AdvancedMarker,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { PlaceAutocomplete } from "./PlaceAutocomplete.tsx";

type HomePageMapProps = {
  setLocation: (location: google.maps.places.Place) => void;
};

const MapComponent = ({ setLocation }: HomePageMapProps) => {
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngAltitude>();

  const [place, setPlace] = useState<google.maps.places.Place | null>(null);
  const [placeService, setPlaceService] =
    useState<google.maps.places.PlacesService | null>();
  const [geoCoder, setGeoCoder] = useState<google.maps.Geocoder | null>();

  const focusMap = (map: google.maps.Map, lat: number, lng: number) => {
    setMarkerPosition(
      new google.maps.LatLngAltitude({ lat: lat, lng: lng, altitude: 0 }),
    );
    map.panTo(
      new google.maps.LatLngAltitude({ lat: lat, lng: lng, altitude: 0 }),
    );
  };

  const focusPlace = (
    map: google.maps.Map,
    place: google.maps.places.Place,
  ) => {
    if (place.location) {
      const loc: google.maps.LatLng | null = place.location;
      if (loc) {
        let lat = loc["lat"];
        let lng = loc["lng"];

        if (typeof lat === "function" && typeof lng === "function") {
          focusMap(map, lat(), lng());
        } else {
          // @ts-ignore
          focusMap(map, lat, lng);
        }
      }
    }
    setLocation(place);
    setPlace(place);
  };

  // Handle map click to set a marker
  const handleMapClick = (event: MapMouseEvent) => {
    geoCoder
      ?.geocode({
        location: {
          lat: event.detail.latLng?.lat ?? 0,
          lng: event.detail.latLng?.lng ?? 0,
        },
      })
      .then(async (r: google.maps.GeocoderResponse) => {
        if (r.results && r.results[0]) {
          const place = new google.maps.places.Place({
            // @ts-ignore
            id: r.results[0].place_id,
          });
          await place.fetchFields({
            fields: [
              "displayName",
              "formattedAddress",
              "location",
              "id",
              "editorialSummary",
            ],
          });

          focusPlace(map!, place);
        }
      });
  };

  const apiIsLoaded = useApiIsLoaded();
  let map = useMap();

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    // @ts-ignore
    let placesService = new google.maps.places.PlacesService(map);

    setPlaceService(placesService);
    setGeoCoder(new google.maps.Geocoder());

    placesService.textSearch(
      {
        query: "Bouvet Stavanger",
        location: { lat: 58.91674, lng: 5.732428 },
      },
      async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const placeResult = results?.[0];
          if (placeResult) {
            const place = new google.maps.places.Place({
              // @ts-ignore
              id: placeResult.place_id,
            });
            await place.fetchFields({
              fields: [
                "displayName",
                "formattedAddress",
                "location",
                "id",
                "editorialSummary",
              ],
            });

            focusPlace(map!, place);
          }
        }
      },
    );
  }, [apiIsLoaded, map]);

  return (
    <Map
      defaultZoom={15}
      defaultCenter={{ lat: 58.91674, lng: 5.732428 }}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      mapId={"5cb5153369603482"}
      onClick={handleMapClick}
    >
      <PlaceAutocomplete onPlaceSelect={(place) => focusPlace(map!, place)} />
      <AdvancedMarker
        position={{
          lat: markerPosition?.lat ?? 0,
          lng: markerPosition?.lng ?? 0,
        }}
      />
    </Map>
  );
};

export default MapComponent;
