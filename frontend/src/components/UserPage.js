import React, { useState, useEffect } from 'react';
import Map from './Map';
import DriverInfo from './DriverInfo';
import LocationSearch from './LocationSearch';
import { subscribeToDriverUpdates, subscribeToServerConnection, requestRide, subscribeToRideAccepted } from '../services/socketService';
import '../styles/UserPage.css';
import { calculateETA } from '../utils';

function UserPage() {
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle');
  const [eta, setEta] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation([position.coords.longitude, position.coords.latitude]),
      (error) => console.error("Error getting user location:", error)
    );

    const unsubscribeDriverUpdates = subscribeToDriverUpdates((data) => {
      console.log('Received driver update:', data);
      setDriverLocation(data.location);
      setDriverInfo(data.info);
      if (userLocation && data.location) {
        const estimatedEta = calculateETA(userLocation, data.location);
        setEta(estimatedEta);
      }
    });

    const unsubscribeServerConnection = subscribeToServerConnection(() => {
      setIsServerConnected(true);
    });

    const unsubscribeRideAccepted = subscribeToRideAccepted((data) => {
      setRideStatus('accepted');
      setDriverLocation(data.driverLocation);
      setDriverInfo({
        name: data.driverInfo.name,
        vehicle: data.driverInfo.vehicle
      });
      if (userLocation && data.driverLocation) {
        const estimatedEta = calculateETA(userLocation, data.driverLocation);
        setEta(estimatedEta);
      }
    });

    return () => {
      unsubscribeDriverUpdates();
      unsubscribeServerConnection();
      unsubscribeRideAccepted();
    };
  }, [userLocation]);

  const handleRequestRide = () => {
    if (userLocation && destination) {
      setRideStatus('requesting');
      requestRide('user123', userLocation, destination.coordinates)
        .then(response => {
          console.log(response);
          setRideStatus('waiting');
        })
        .catch(error => {
          console.error('Error requesting ride:', error);
          setRideStatus('idle');
        });
    }
  };

  const handleLocationSelect = (location) => {
    setDestination(location);
  };

  const handleCancelDestination = () => {
    setDestination(null);
  };

  return (
    <div className="user-page">
      <div className="container">
        <h1>Track Your Driver</h1>
        {!isServerConnected && (
          <div className="server-status">Server is not connected. Please wait...</div>
        )}
        <div className="tracking-container">
          {isServerConnected ? (
            <Map 
              userLocation={userLocation} 
              driverLocation={driverLocation} 
              destination={destination ? destination.coordinates : null}
            />
          ) : (
            <div className="loading">Waiting for server connection...</div>
          )}
          <DriverInfo info={driverInfo} eta={eta} />
        </div>
        <div className="ride-request">
          <LocationSearch onLocationSelect={handleLocationSelect} onCancelDestination={handleCancelDestination} />
          {destination && <p>Selected destination: {destination.name}</p>}
          <button onClick={handleRequestRide} disabled={rideStatus !== 'idle' || !destination}>
            {rideStatus === 'idle' ? 'Request Ride' : 
             rideStatus === 'requesting' ? 'Requesting...' : 
             rideStatus === 'waiting' ? 'Waiting for driver...' : 
             'Driver on the way'}
          </button>
          {rideStatus === 'accepted' && eta && (
            <p>Driver has accepted your ride! ETA: {eta} minutes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;