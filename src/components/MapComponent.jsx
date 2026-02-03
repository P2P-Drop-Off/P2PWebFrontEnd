import React, { useEffect, useRef, useState } from 'react';
import { fetchLocations } from '../functions/locationService';

const MapComponent = ({ height = '100%', width = '100%', markers = [], onMarkerClick, center }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const locationMarkersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [showZipInput, setShowZipInput] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Function to center map on a location
  const centerMapOnLocation = (location) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(15);

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setPosition(location);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }
        });
      }
    }
  };

  // Function to get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setShowZipInput(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        centerMapOnLocation(location);
      },
      (err) => {
        console.error('Error getting location:', err);
        // Don't show error, just show zip code input as alternative
        setShowZipInput(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Function to geocode zip code and center map
  const handleZipCodeSubmit = (e) => {
    e.preventDefault();
    if (!zipCode.trim() || !geocoderRef.current) return;

    geocoderRef.current.geocode(
      { address: zipCode.trim() },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          const locationObj = { lat, lng };

          setUserLocation(locationObj);
          centerMapOnLocation(locationObj);
        } else {
          console.error('Geocode was not successful for the following reason:', status);
          // Could show a brief error message here if needed
        }
      }
    );
  };

  // Function to load locations and display them on the map
  const loadLocations = async () => {
    try {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);

      if (mapInstanceRef.current && window.google) {
        // Clear existing markers
        locationMarkersRef.current.forEach(marker => marker.setMap(null));
        locationMarkersRef.current = [];

        // Create markers for each location
        fetchedLocations.forEach((location) => {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstanceRef.current,
            title: location.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          });

          // Add click listener to show location details
          marker.addListener('click', () => {
            setSelectedLocation(location);
          });

          locationMarkersRef.current.push(marker);
        });
      }
    } catch (err) {
      console.error('Error loading locations:', err);
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) return; // 👈 prevent re-init
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn('Google Maps API key not found. Map will be disabled.');
      setLoading(false);
      return;
    }

    const initMap = () => {
      try {
        if (mapRef.current && window.google) {
          console.log('Initializing map...');

          // Default center (Irvine) - will be updated when user location is obtained
          const defaultCenter = { lat: 33.6846, lng: -117.8265 };

          const mapOptions = {
            center: center || defaultCenter,
            zoom: 13,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            disableDefaultUI: markers.length > 0, // Enable UI for vendor map, disable for simple map
          };

          const map = new window.google.maps.Map(mapRef.current, mapOptions);
          mapInstanceRef.current = map;
          geocoderRef.current = new window.google.maps.Geocoder();

          // Handle external markers (from props)
          if (markers.length > 0) {
            markers.forEach(loc => {
              const marker = new window.google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map: map,
                title: loc.name,
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
                }
              });

              if (onMarkerClick) {
                marker.addListener('click', () => onMarkerClick(loc));
              }
            });
          } else {
            // Only request user location if NOT using external markers (to avoid hijacking wizard view)
            getUserLocation();
            loadLocations();
          }

          console.log('Map initialized successfully');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map: ' + err.message);
        setLoading(false);
      }
    };

    const handleScriptError = () => {
      setError('Failed to load Google Maps.');
      setLoading(false);
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = handleScriptError;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [markers, center]);

  return (
    <div style={{ position: 'relative', width: width, height: height, borderRadius: 'inherit' }}>
      {loading && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 1000, backgroundColor: 'white', padding: '15px', borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center'
        }}>
          <div>Loading Maps...</div>
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 1000, backgroundColor: '#ffebee', color: '#c62828', padding: '15px',
          borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem'
        }}>
          <div>{error}</div>
        </div>
      )}

      {/* Zip Code Input - shown when location is not available and no external markers */}
      {showZipInput && !error && !loading && markers.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
            Find a vendor to drop off your item
          </div>
          <form onSubmit={handleZipCodeSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter zip code"
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
                width: '300px',
                outline: 'none',
                color: '#333',
                backgroundColor: 'white'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(90deg, #6fb3ff, #c58bff)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: '0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Location Details Panel */}
      {selectedLocation && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          maxWidth: '400px',
          width: 'calc(100% - 40px)',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {selectedLocation.name}
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: 0,
                lineHeight: 1
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
            {selectedLocation.address}
          </p>

          {selectedLocation.phoneNumber && (
            <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
              <strong>Phone:</strong> {selectedLocation.phoneNumber}
            </p>
          )}

          {selectedLocation.hours && (
            <div style={{ marginTop: '12px' }}>
              <strong style={{ fontSize: '14px', color: '#333' }}>Hours:</strong>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                {Object.entries(selectedLocation.hours).map(([day, hours]) => (
                  <div key={day} style={{ marginBottom: '4px' }}>
                    <strong>{day}:</strong> {hours}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default MapComponent;
