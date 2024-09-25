import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export function subscribeToDriverUpdates(callback) {
  socket.on('driverUpdate', callback);
  return () => socket.off('driverUpdate', callback);
}

export function emitDriverLocation(location) {
  socket.emit('driverLocation', location);
}