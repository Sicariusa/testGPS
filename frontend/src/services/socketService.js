import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export const subscribeToDriverUpdates = (callback) => {
  socket.on('driverUpdate', callback);
  return () => socket.off('driverUpdate', callback);
};

export const subscribeToServerConnection = (callback) => {
  socket.on('serverConnected', callback);
  return () => socket.off('serverConnected', callback);
};

export function emitDriverLocation(location) {
  socket.emit('driverLocation', location);
}

export function requestRide(userId, userLocation, destination) {
  return fetch('http://localhost:3001/api/ride-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, userLocation, destination }),
  }).then(response => response.json());
}

export function subscribeToRideRequests(callback) {
  socket.on('rideRequest', callback);
  return () => socket.off('rideRequest', callback);
}

export function acceptRide(rideId, driverId) {
  socket.emit('acceptRide', { rideId, driverId });
}

export function subscribeToRideAccepted(callback) {
  socket.on('rideAccepted', callback);
  return () => socket.off('rideAccepted', callback);
}

export function subscribeToRideUnavailable(callback) {
  socket.on('rideUnavailable', callback);
  return () => socket.off('rideUnavailable', callback);
}