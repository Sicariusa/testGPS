const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let driverLocations = {};
let activeRideRequests = {};

app.use(express.json());

app.post('/api/ride-request', (req, res) => {
  const { userId, userLocation, destination } = req.body;
  const rideId = Date.now().toString();
  
  activeRideRequests[rideId] = {
    userId,
    userLocation,
    destination,
    status: 'pending',
    nearbyDrivers: []
  };

  // Find nearby drivers (simplified version)
  const nearbyDrivers = Object.keys(driverLocations).filter(driverId => {
    const driver = driverLocations[driverId];
    const distance = calculateDistance(userLocation, driver.location);
    return distance <= 5; // 5 km radius
  });

  activeRideRequests[rideId].nearbyDrivers = nearbyDrivers;

  // Notify nearby drivers
  nearbyDrivers.forEach(driverId => {
    io.to(driverId).emit('rideRequest', { rideId, userLocation, destination });
  });

  res.json({ rideId, message: 'Ride request sent to nearby drivers' });
});

function calculateDistance(loc1, loc2) {
  // Simplified distance calculation (you may want to use a more accurate method)
  const dx = loc1[0] - loc2[0];
  const dy = loc1[1] - loc2[1];
  return Math.sqrt(dx * dx + dy * dy) * 111; // Rough conversion to km
}

try {
  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Send a connection confirmation to the client
    socket.emit('serverConnected');

    socket.on('driverLocation', (location) => {
      console.log('Driver location update received:', socket.id, location);
      driverLocations[socket.id] = { location, socketId: socket.id };
      io.emit('driversUpdate', driverLocations);
    });

    socket.on('requestRide', ({ userId, userLocation, destination }) => {
      console.log('Ride request received:', userId, userLocation, destination);
      const rideId = Date.now().toString();
      
      activeRideRequests[rideId] = {
        userId,
        userLocation,
        destination,
        status: 'pending',
        nearbyDrivers: []
      };

      // Find nearby drivers (simplified version)
      const nearbyDrivers = Object.keys(driverLocations).filter(driverId => {
        const driver = driverLocations[driverId];
        const distance = calculateDistance(userLocation, driver.location);
        return distance <= 5; // 5 km radius
      });

      activeRideRequests[rideId].nearbyDrivers = nearbyDrivers;

      // Notify nearby drivers
      nearbyDrivers.forEach(driverId => {
        console.log('Sending ride request to driver:', driverId);
        io.to(driverId).emit('rideRequest', { rideId, userLocation, destination });
      });

      socket.emit('rideRequestResponse', { success: true, rideId, message: 'Ride request sent to nearby drivers' });
    });

    socket.on('acceptRide', ({ rideId, driverId }) => {
      console.log('Ride accepted:', rideId, driverId);
      if (activeRideRequests[rideId] && activeRideRequests[rideId].status === 'pending') {
        activeRideRequests[rideId].status = 'accepted';
        activeRideRequests[rideId].driverId = driverId;
        
        // Notify the user that a driver accepted
        io.to(activeRideRequests[rideId].userId).emit('rideAccepted', { 
          rideId, 
          driverLocation: driverLocations[driverId].location 
        });

        // Notify other drivers that the ride is no longer available
        activeRideRequests[rideId].nearbyDrivers.forEach(nearbyDriverId => {
          if (nearbyDriverId !== driverId) {
            io.to(nearbyDriverId).emit('rideUnavailable', { rideId });
          }
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
      delete driverLocations[socket.id];
      io.emit('driversUpdate', driverLocations);
    });
  });
  
} catch (error) {
  throw new Error(error);
}

app.get('/', (req, res) => {
  res.send('Driver Tracking Server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));