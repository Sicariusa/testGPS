import React, { useState, useEffect } from 'react';
import { emitDriverLocation } from '../services/socketService';

function DriverPage() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setLocation(newLocation);
        emitDriverLocation(newLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <h1>Driver Page</h1>
      {location ? (
        <p>Your current location: {location[0]}, {location[1]}</p>
      ) : (
        <p>Getting your location...</p>
      )}
    </div>
  );
}

export default DriverPage;
