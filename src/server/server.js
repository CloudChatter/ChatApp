require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

io.on('connection', (socket) => {
  console.log('socket.io is connected');

  io.on('connection', (socket) => {
    console.log('socket.io is connected on the server')
    socket.on('message', data => {
      console.log('message on the server', data)
      io.emit('message', data)
    })
  })

  app.use('/build', express.static(path.join(__dirname, '../../build')));

  // app.get('/build/bundle.js', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../../build/bundle.js'));
  // });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
  });

  server.listen(3000, () => {
    console.log('server listening at port 3000');
  });
