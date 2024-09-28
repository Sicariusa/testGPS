import React, { useState, useEffect } from 'react';
import { emitDriverLocation, subscribeToRideRequests, acceptRide, subscribeToRideUnavailable } from '../services/socketService';
import '../styles/DriverPage.css';

function DriverPage() {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    let watchId;

    if (isTracking) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = [position.coords.longitude, position.coords.latitude];
          setLocation(newLocation);
          emitDriverLocation(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    const handleRideRequest = (request) => {
      console.log('Received ride request:', request);
      setRideRequests(prev => {
        if (!prev.some(r => r.rideId === request.rideId)) {
          return [...prev, request];
        }
        return prev;
      });
    };

    const unsubscribeRideRequests = subscribeToRideRequests(handleRideRequest);
    const unsubscribeRideUnavailable = subscribeToRideUnavailable(({ rideId }) => {
      setRideRequests(prev => prev.filter(req => req.rideId !== rideId));
    });

    return () => {
      unsubscribeRideRequests();
      unsubscribeRideUnavailable();
    };
  }, []);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      // When starting tracking, emit the initial location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.longitude, position.coords.latitude];
          setLocation(newLocation);
          emitDriverLocation(newLocation);
        },
        (error) => {
          console.error("Error getting initial location:", error);
        }
      );
    }
  };

  const handleAcceptRide = (rideId) => {
    const driverInfo = {
      name: 'John Doe', // Replace with actual driver name
      vehicle: 'Toyota Camry' // Replace with actual vehicle info
    };
    acceptRide(rideId, 'driver123', driverInfo);
    setRideRequests(prev => prev.filter(req => req.rideId !== rideId));
  };

  return (
    <div className="driver-page">
      <div className="container">
        <h1>Driver Dashboard</h1>
        <div className="status-container">
          <div className="status">
            <h2>Tracking Status</h2>
            <p>{isTracking ? 'Active' : 'Inactive'}</p>
          </div>
          <button className={`btn ${isTracking ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleTracking}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>
        {location && (
          <div className="location">
            <h2>Current Location</h2>
            <p>Latitude: {location[1]}</p>
            <p>Longitude: {location[0]}</p>
          </div>
        )}
        <div className="ride-requests">
          <h2>Ride Requests</h2>
          {rideRequests.length === 0 ? (
            <p>No ride requests at the moment.</p>
          ) : (
            rideRequests.map((request) => (
              <div key={request.rideId} className="ride-request">
                <p>From: {request.userLocation.join(', ')}</p>
                <p>To: {request.destination.join(', ')}</p>
                <button onClick={() => handleAcceptRide(request.rideId)}>Accept Ride</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverPage;