require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

io.on('connection', (socket) => {
  console.log('socket.io is connected on the server')
  socket.on('message', data => {
    console.log('message on the server', data)
    io.emit('newMessage', data)
  })
})


// createa  button to save the current chat to DB (post reequest to db)
// send along the username

// DB: ILoveDogs = [{[{}{}{}],[{}{}{}{}]]


app.use('/build', express.static(path.join(__dirname, '../../build')));

app.get('/build/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/bundle.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get("/messages", messageController.getMessages, (req, res) => {
  res.status(200).json(res.locals.messages);
});

app.post(
  "/messages",
  messageController.postMessage,
  (req, res) => {
    res.status(200);
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
