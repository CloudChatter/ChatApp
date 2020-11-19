require('dotenv').config();
const express = require('express');
const app = express();
require('./passport-setup');
const userController = require('./controllers/userController');
const cors = require('cors');
const messageController = require('../server/controllers/messageController');
const path = require('path');
const passport = require('passport');

// WEBSOCKET CONFIG
const server = require('http').createServer(app);
const options = { cors: true, origin: ['http://localhost:8080'] };
const io = require('socket.io')(server, options);

io.on('connection', (socket) => {
  console.log('a user has connected to the socket');
  
  socket.on('message', (data) => {
    // console.log('message on the server', data)
    io.emit('newMessage', data);
  });

  // socket.on('get all data', () => {
  //   const data = {
  //     usersOnline: io.engine.clientsCount,
  //     socketIDs: Object.keys(io.eio.clients)
  //   }
  //   io.emit('all user data', data)
  // })

  socket.on('new user', (username) => {
    const data = {}
    data.socketID = socket.id
    // data.usersOnline = io.engine.clientsCount
    data.username = username
    // console.log('new user data on the server', data)
    io.emit('add user to state', data)
    // console.log(Object.keys(io.eio.clients))
    
  })

  socket.on('disconnect', () => {
    console.log('client disconnected')
    io.emit('user left', socket.id)
  })
});

//

// Application Level Middleware
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');
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

const afterAuthCB = (req, res) => {
  console.log('in afterAuthCB');
  if (req.isAuthenticated()) {
    console.log('after authentication, user is', req.user);
    const { username } = req.user;
    res.json({
      isAuth: true,
      username,
    });
  } else
    res.json({
      isAuth: false,
    });
};

app.get(
  '/auth/google',
  (req, res, next) => {
    console.log('get request to auth/google');
    return next();
  },
  passport.authenticate('google', { scope: ['profile'] })
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
  // afterAuthCB
);

app.get('/chat', (req, res) => {
  console.log('in callback for /chat');
  // if user is authenticated, let them proceed to the index.html with the /chat endpoint, otherwise make them send a get request to '/' so they'll end up with the '/' endpoint
  // redirect is working BUT we are not actually sending the user info from server to client side
  // POSSIBLE: have the chat component set a GET request to '/api/success' endpoint and get the user info, then update the state
  // NEXT figure out how to make 8080 remain on 8080, otherwise loses HMR - not a big issue
  // WORKAROUND log in then go to 8080/chat directly since cookie has active session...
  // TODO set up register frontend so you can log in using local strat and should not have this issue of being redirected to 3000 (callback url of google)
  if (req.isAuthenticated()) {
    console.log('in /chat, authenticated with user', req.user);
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

app.post('/api/login', passport.authenticate('local'), afterAuthCB);

app.use('/build', express.static(path.join(__dirname, '../../build')));

app.get('/build/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/bundle.js'));
});

app.get('/', (req, res) => {
  console.log('req.user', req.user);
  console.log('req.cookie', req.cookies);
  console.log('is request authenticated?', req.isAuthenticated());
  // console.log('what is in session', session);
  console.log('what is in req.session', req.session);
  res.sendFile(path.join(__dirname, '../../index.html'));
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

// https://medium.com/free-code-camp/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0
