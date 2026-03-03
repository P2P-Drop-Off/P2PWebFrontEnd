// AddressAutocomplete.jsx – Google Places Autocomplete with 3 suggestions.
// Form is valid only when a suggestion is selected (ensures valid location).

import React, { useState, useEffect, useRef, useCallback } from "react";

const GOOGLE_SCRIPT_ID = "google-maps-places-partner-form";

function loadGooglePlacesScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      const check = () => {
        if (window.google?.maps?.places) resolve();
        else setTimeout(check, 100);
      };
      check();
      return;
    }
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

function parseAddressComponents(components) {
  const get = (type) => {
    const c = components.find((x) => x.types.includes(type));
    return c ? c.long_name : "";
  };
  const getShort = (type) => {
    const c = components.find((x) => x.types.includes(type));
    return c ? c.short_name : "";
  };
  const streetNumber = get("street_number");
  const route = get("route");
  const street = [streetNumber, route].filter(Boolean).join(" ").trim() || get("premise") || "";
  const city = get("locality") || get("sublocality") || get("administrative_area_level_2") || "";
  const state = getShort("administrative_area_level_1");
  const zip = get("postal_code");
  const suite = get("subpremise") || "";
  return { street, city, state, zip, suite };
}

export default function AddressAutocomplete({ value, onChange, onPlaceSelect, error, disabled }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [inputValue, setInputValue] = useState(value ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const placesDivRef = useRef(null);

  useEffect(() => {
    if (!apiKey) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY not set; address autocomplete disabled.");
      return;
    }
    loadGooglePlacesScript(apiKey)
      .then(() => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        if (placesDivRef.current) {
          placesServiceRef.current = new window.google.maps.places.PlacesService(placesDivRef.current);
        }
        setGoogleReady(true);
      })
      .catch((err) => console.error("Google Places load error:", err));
  }, [apiKey]);

  useEffect(() => {
    if (!placesDivRef.current || !googleReady) return;
    placesServiceRef.current = new window.google.maps.places.PlacesService(placesDivRef.current);
  }, [googleReady]);

  const fetchSuggestions = useCallback(
    (input) => {
      if (!input || input.trim().length < 3 || !autocompleteServiceRef.current) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: input.trim(),
          componentRestrictions: { country: "us" },
          types: ["address"],
        },
        (predictions, status) => {
          setLoading(false);
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
            return;
          }
          setSuggestions(predictions.slice(0, 3));
        }
      );
    },
    []
  );

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(inputValue), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fetchSuggestions]);

  const handleSelectPlace = (prediction) => {
    if (!placesServiceRef.current || !prediction.place_id) return;
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["address_components", "formatted_address"],
      },
      (place, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place?.address_components) {
          return;
        }
        const parsed = parseAddressComponents(place.address_components);
        const formatted = place.formatted_address || prediction.description;
        setInputValue(formatted);
        setSuggestions([]);
        onChange?.(formatted);
        onPlaceSelect?.(parsed, formatted);
      }
    );
  };

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div className="form-group address-autocomplete-wrap">
      <label>Address *</label>
      <input
        type="text"
        className={`input address-autocomplete-input ${error ? "input-error" : ""}`}
        placeholder="Start typing to see address suggestions..."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        disabled={disabled}
        autoComplete="off"
      />
      {loading && (
        <span className="address-autocomplete-loading" aria-hidden="true">
          Searching...
        </span>
      )}
      {showDropdown && (
        <ul className="address-autocomplete-dropdown" role="listbox">
          {suggestions.map((p) => (
            <li
              key={p.place_id}
              role="option"
              className="address-autocomplete-suggestion"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectPlace(p);
              }}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
      {error && <span className="error-text">{error}</span>}
      <div ref={placesDivRef} aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1 }} />
    </div>
  );
}
