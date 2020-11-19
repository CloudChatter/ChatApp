const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const db = require('./dbModel');
const bcrypt = require('bcrypt');

passport.serializeUser((user, cb) => {
  console.log('serializing user!', user);
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  const queryStr = `SELECT * FROM PUBLIC.USERS WHERE _id = $1`;
  db.query(queryStr, [id])
    .then((data) => {
      const user = data.rows[0];
      cb(null, user);
    })
    .catch((err) => cb(err));
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, cb) => {
    console.log('email and password', email, password);
    const queryStr = `SELECT * FROM PUBLIC.USERS WHERE email = $1`;
    console.log('in cb of localstrat setup');
    db.query(queryStr, [email])
      .then((data) => {
        if (!data.rows[0]) {
          return cb(null, false);
        }
        const user = data.rows[0];
        console.log('found user is', user);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return cb(err);
          if (!result) return cb(null, false);
          return cb(null, user);
        });
      })
      .catch((err) => cb(err));
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_clientID,
      clientSecret: process.env.GOOGLE_clientSecret,
      // this has to match wat was provided to google on goole website
      callbackURL: 'http://localhost:3000/auth/google/chat',
    },
    (acessToken, refreshToken, profile, cb) => {
      console.log('profile from Google is', profile);
      const { id, displayName, photos, emails } = profile;
      const email = emails[0].value;
      const photoURL = photos[0].value;

      // we have access to email and photoURL now

      const newUser = { google_id: id, username: displayName };

      // insert logic for checking if the user exists in user database
      const queryStr = `SELECT * FROM PUBLIC.USERS WHERE google_id = $1`;
      db.query(queryStr, [id])
        .then((data) => {
          if (data.rows[0]) {
            const user = data.rows[0];
            return cb(null, user);
          }
          // if not, insert into database
          const queryString = `INSERT INTO PUBLIC.USERS (google_id, username)
          VALUES ($1, $2)
          RETURNING *`;
          const values = [id, displayName];
          db.query(queryString, values)
            .then((data) => {
              if (!data.rows[0])
                return next({ message: 'nothing from database' });
              const user = data.rows[0];
              return cb(null, user);
            })
            .catch((err) => {
              console.log('error in createUser', err);
              return cb(err);
            });
        })
        .catch((err) => cb(err));
    }
  )
);


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/chat"
},
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
    const { id, displayName } = profile;
    const newUser = { facebook_id: id, username: displayName }

    const queryStr = `SELECT * FROM PUBLIC.USERS WHERE facebook_id = $1`
    db.query(queryStr, [id])
      .then((data) => {
        if (data.rows[0]) {
          const user = data.rows[0];
          return cb(null, user)
        }

        const queryString = `INSERT INTO PUBLIC.USERS (facebook_id, username)
        VALUES ($1, $2)
        RETURNING *`;
        const values = [id, displayName];
        db.query(queryString, values)
          .then((data) => {
            if (!data.rows[0])
              return next({ message: 'nothing from database' });
            const user = data.rows[0];
            return cb(null, user);
          })
          .catch((err) => {
            console.log('error in createUser using facebook OAuth', err);
            return cb(err);
          })
      })
      .catch((err) => cb(err));
  }
));