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

// Simulated driver data
let driverLocation = { lat: 40.7128, lng: -74.0060 };
let direction = 1; // 1 for moving north, -1 for moving south

// Emit driver location updates every 5 seconds
setInterval(() => {
  // Simulate movement in a more predictable pattern
  driverLocation.lat += 0.0005 * direction;
  
  // Change direction if we've moved too far
  if (driverLocation.lat > 40.75 || driverLocation.lat < 40.70) {
    direction *= -1;
  }
  
  io.emit('driverUpdate', {
    location: [driverLocation.lat, driverLocation.lng],
    info: { name: 'John Doe', vehicle: 'Toyota Prius', eta: '10 minutes' }
  });
}, 5000);

app.get('/', (req, res) => {
  res.send('Driver Tracking Server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
