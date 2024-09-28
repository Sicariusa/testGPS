import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkbzAiLCJhIjoiY2x5dDF4MjkwMGRtMTJqb3Q3MG81dGJpeCJ9.LRT9kWKN_D5kHOdH4o6qbA';

function Map({ userLocation, driverLocation, destination }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const driverMarker = useRef(null);
  const destinationMarker = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation || [0, 0],
      zoom: 12
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    if (userLocation) {
      if (!userMarker.current) {
        userMarker.current = new mapboxgl.Marker({ color: '#3887be' })
          .setLngLat(userLocation)
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat(userLocation);
      }
      map.current.flyTo({ center: userLocation });
    }

    if (driverLocation) {
      if (!driverMarker.current) {
        driverMarker.current = new mapboxgl.Marker({ color: '#f30' })
          .setLngLat(driverLocation)
          .addTo(map.current);
      } else {
        driverMarker.current.setLngLat(driverLocation);
      }
    }

    if (destination) {
      if (!destinationMarker.current) {
        destinationMarker.current = new mapboxgl.Marker({ color: '#33cc33' })
          .setLngLat(destination)
          .addTo(map.current);
      } else {
        destinationMarker.current.setLngLat(destination);
      }
      map.current.flyTo({ center: destination });
    } else if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
  }, [userLocation, driverLocation, destination]);

  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
}

export default Map;