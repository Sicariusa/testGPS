import React, { useState, useEffect, useRef } from 'react';
import Map from './Map';
import DriverInfo from './DriverInfo';
import { subscribeToDriverUpdates } from '../services/socketService';
import '../styles/UserPage.css';

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
    <div className="user-page">
      <div className="container">
        <h1>Track Your Driver</h1>
        <div className="tracking-container">
          {driverLocation ? (
            <Map driverLocation={driverLocation} mapRef={mapRef} />
          ) : (
            <div className="loading">Waiting for driver location...</div>
          )}
          <DriverInfo info={driverInfo} />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
