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

let driverLocation = null;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('driverLocation', (location) => {
    driverLocation = location;
    io.emit('driverUpdate', {
      location: driverLocation,
      info: { name: 'John Doe', vehicle: 'Toyota Prius', eta: '10 minutes' }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Driver Tracking Server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
