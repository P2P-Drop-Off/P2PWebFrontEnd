// src/pages/Map.jsx
import React from 'react';
import MapComponent from '../components/MapComponent';
import Header from '../components/Header';
import '../css/style.css';

export default function Map() {
  return (
    <div className="map-page">
      <Header />
      <MapComponent />
    </div>
  );
}

