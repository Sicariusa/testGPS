import React, { useState, useEffect, useRef } from 'react';
import Map from './Map';
import DriverInfo from './DriverInfo';
import { subscribeToDriverUpdates } from '../services/socketService';

function UserPage() {
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToDriverUpdates((data) => {
      console.log('Received driver update:', data);
      setDriverLocation(data.location);
      setDriverInfo(data.info);
      if (mapRef.current && data.location) {
        mapRef.current.setView(data.location, 13);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>User View</h1>
      {driverLocation ? (
        <Map driverLocation={driverLocation} mapRef={mapRef} />
      ) : (
        <p>Waiting for driver location...</p>
      )}
      <DriverInfo info={driverInfo} />
    </div>
  );
}

export default UserPage;
