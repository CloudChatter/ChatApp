require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const messageController = require("../server/controllers/messageController")

app.use(express.json())

// WEBSOCKET CONFIG
const server = require('http').createServer(app);
const options = { cors: true, origin: ['http://localhost:8080'] };
const io = require('socket.io')(server, options);
io.on('connection', (socket) => {
  console.log('socket.io is connected on the server')
  socket.on('message', data => {
    console.log('message on the server', data)
    io.emit('newMessage', data)
  })
})

//

app.use('/build', express.static(path.join(__dirname, '../../build')));

app.get('/build/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/bundle.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get("/api/messages", messageController.getMessages, (req, res) => {
  console.log('api/messages data', res.locals.messages);
   return res.status(200).send({data: res.locals.messages});
});

app.post(
  "/api/messages",
  messageController.postMessage,
  (req, res) => {
    if (res.locals.messageAdded) console.log('message successfully added to DB')
    return res.status(200);
  }
);

app.use((err, req, res, next) => {
  const defaultError = {
    log: "Error during unknown middleware",
    status: 400,
    message: { err: "Middleware error." },
  };
  const errorObj = Object.assign({}, defaultError, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
server.listen(3000, () => {
  console.log('server listening at port 3000');
});
