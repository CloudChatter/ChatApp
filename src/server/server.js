require('dotenv').config();
const express = require('express');
const app = express();
require('./passport-setup');
const userController = require('./userController');

const server = require('http').createServer(app);
const options = { cors: true, origin: ['http://localhost:8080'] };
// const server = require('http').createServer();
// const options = { cors: true, origin: ['*'] };
const io = require('socket.io')(server, options);
const path = require('path');
const passport = require('passport');

io.on('connection', (socket) => {
  console.log('socket.io is connected on the server');
  socket.on('message', (data) => {
    console.log('message on the server', data);
    io.emit('newMessage', data);
  });
});

// createa  button to save the current chat to DB (post reequest to db)
// send along the username

// DB: ILoveDogs = [{[{}{}{}],[{}{}{}{}]]

// Application Level Middleware
const cookieParser = require('cookie-parser');
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
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/auth/google/chat',
  passport.authenticate('google', { failureRedirect: '/' }),
  afterAuthCB
);

app.post(
  '/api/register',
  userController.createUser,
  passport.authenticate('local'),
  afterAuthCB
);

app.post('/api/login', passport.authenticate('local'), afterAuthCB);

// app.get('/chat', (req, res, next) => {
//   console.log('access to /chat is authenticated?', req.isAuthenticated());
//   if (req.isUnauthenticated()) res.redirect('/');
//   else res.status(200);
// });

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

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: `An error occured. ERROR: ${JSON.stringify(err)}` },
  };

  const errObj = Object.assign({}, defaultErr, err);

  console.log(errObj.log);

  return res.status(errObj.status).json(errObj.message);
});

server.listen(3000, () => {
  console.log('server listening at port 3000');
});
