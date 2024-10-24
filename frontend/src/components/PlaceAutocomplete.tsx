import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./AutoComplete.css";

interface Props {
  onPlaceSelect: (place: google.maps.places.Place) => void;
}

export const PlaceAutocomplete = ({ onPlaceSelect }: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places) return;
    // @ts-expect-error Using an alpha feature here. The types are not up to date yet
    setPlaceAutocomplete(new places.PlaceAutocompleteElement());
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addEventListener(
      "gmp-placeselect",
      // @ts-expect-error This event has no types yet
      async ({ place }: { place: google.maps.places.Place }) => {
        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "viewport",
            "id",
            "editorialSummary",
          ],
        });

        // @ts-ignore
        onPlaceSelect(place.toJSON());
      },
    );

    if (!containerRef.current?.hasChildNodes()) {
      containerRef.current?.appendChild(placeAutocomplete);
    }
  }, [onPlaceSelect, placeAutocomplete]);

  return <div className="autocomplete-container" ref={containerRef} />;
};
