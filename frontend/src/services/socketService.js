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