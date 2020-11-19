require('dotenv').config();
const express = require('express');
const app = express();
require('./passport-setup');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Controllers
const messageController = require('../server/controllers/messageController');
const userController = require('./controllers/userController');

// WEBSOCKET CONFIG
const server = require('http').createServer(app);
const options = { cors: true, origin: ['http://localhost:8080'] };
const io = require('socket.io')(server, options);

io.on('connection', (socket) => {
  console.log('socket.io is connected on the server');
  socket.on('message', (data) => {
    io.emit('newMessage', data);
  });
});

// Application Level Middleware
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Function to check if request is authenticated, if so send username and isAuth back
const afterAuthCB = (req, res) => {
  if (req.isAuthenticated()) {
    console.log('after authentication, user is', req.user);
    const { username } = req.user;
    res.json({
      isAuth: true,
      username,
    });
  } else {
    console.log('in afterAuthCB with unauth user');
    res.json({
      isAuth: false,
    });
  }
};

app.get(
  '/auth/google',
  (req, res, next) => {
    console.log('get request to auth/google');
    return next();
  },
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/chat',
  (req, res, next) => {
    console.log('auth/google/chat???');
    return next();
  },
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/chat',
  })
);

app.get('/chat', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, '../../index.html'));
  } else res.redirect('/');
});

app.get('/api/login/success', afterAuthCB);

app.post(
  '/api/register',
  userController.createUser,
  passport.authenticate('local'),
  afterAuthCB
);

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.post('/api/login', passport.authenticate('local'), afterAuthCB);

app.get('/api/logout', (req, res) => {
  // console.log('logout path, isAuthenticated is', req.isAuthenticated());
  // console.log('is there a req.logout?', String(req.logout));
  console.log('invoking req.logout');
  req.logOut();
  // res.redirect('/');
  res.status(200).json({ isAuth: false, username: undefined });
});

app.use('/build', express.static(path.join(__dirname, '../../build')));

app.get('/build/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/bundle.js'));
});

app.get('/', (req, res) => {
  console.log('get / is request authenticated?', req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.redirect('/chat');
  } else res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get('/api/messages', messageController.getMessages, (req, res) => {
  return res.status(200).send({ data: res.locals.messages });
});

app.post('/api/messages', messageController.postMessage, (req, res) => {
  if (res.locals.messageAdded) console.log('message successfully added to DB');
  return res.status(200);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.use((err, req, res, next) => {
  const defaultError = {
    log: 'Error during unknown middleware',
    status: 400,
    message: { err: 'Middleware error.' },
  };
  const errorObj = Object.assign({}, defaultError, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
server.listen(3000, () => {
  console.log('server listening at port 3000');
});

module.exports = app;
