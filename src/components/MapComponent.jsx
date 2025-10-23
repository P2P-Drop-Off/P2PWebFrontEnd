import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    console.log('API Key:', apiKey ? 'Found' : 'Not found');
    
    if (!apiKey) {
      setError('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      setLoading(false);
      return;
    }

    const initMap = () => {
      try {
        if (mapRef.current && window.google) {
          console.log('Initializing map...');
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco coordinates
            zoom: 13,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          // Add a marker for the user's location (you can customize this)
          new window.google.maps.Marker({
            position: { lat: 37.7749, lng: -122.4194 },
            map: map,
            title: 'Your Location'
          });
          
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
      console.error('Failed to load Google Maps script');
      setError('Failed to load Google Maps. Please check your API key and internet connection.');
      setLoading(false);
    };

    // Load Google Maps script if not already loaded
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
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Loading State */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div>Loading Google Maps...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Error</div>
          <div>{error}</div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      
      {/* User Icon in top right - only show when map is loaded */}
      {!loading && !error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
              stroke="#333" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" 
              stroke="#333" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
