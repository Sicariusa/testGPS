import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export const emitDriverLocation = (location) => {
  socket.emit('driverLocation', location);
};

export const subscribeToDriverUpdates = (callback) => {
  socket.on('driverUpdate', callback);
  return () => socket.off('driverUpdate', callback);
};

export const subscribeToRideRequests = (callback) => {
  console.log('Subscribing to ride requests');
  socket.off('rideRequest'); // Remove any existing listeners
  socket.on('rideRequest', (request) => {
    console.log('Ride request received in socketService:', request);
    callback(request);
  });
  return () => socket.off('rideRequest');
};

export const requestRide = (userId, userLocation, destination) => {
  return new Promise((resolve, reject) => {
    socket.emit('requestRide', { userId, userLocation, destination });
    socket.once('rideRequestResponse', (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const acceptRide = (rideId, driverId, driverInfo) => {
  socket.emit('acceptRide', { rideId, driverId, driverInfo });
};

export const subscribeToRideAccepted = (callback) => {
  socket.on('rideAccepted', callback);
  return () => socket.off('rideAccepted', callback);
};

export const subscribeToRideUnavailable = (callback) => {
  socket.on('rideUnavailable', callback);
  return () => socket.off('rideUnavailable', callback);
};

export const subscribeToServerConnection = (callback) => {
  socket.on('connect', callback);
  return () => socket.off('connect', callback);
};