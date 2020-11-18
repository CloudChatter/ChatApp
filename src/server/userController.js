const db = require('./dbModel');
const bcrypt = require('bcrypt');

const userController = {};
const SALT_WORK_FACTOR = 10;

// userController.verifyCredentials = (req, res, next) => {
//   console.log('post req to login body is', req.body);
//   const { email, password } = req.body;
//   const queryStr = `
//     SELECT * FROM Users
//     WHERE email = $1`;

//   db.query(queryStr, [email]).then((data) => {
//     if (!data.rows[0]) {
//       return next({
//         message: `Error: Email ${email} not found, please sign up`,
//       });
//     }
//     const foundUser = data.rows[0];
//     console.log('foundUser', foundUser);
//     bcrypt.compare(password, foundUser.password, (err, result) => {
//       if (result === true) {
//         res.locals.user = foundUser;
//         // console.log('hello, pw matched!');
//         return next();
//       } else {
//         return next({ message: `Error: password does not match` });
//       }
//     });
//   });
// };

userController.createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, SALT_WORK_FACTOR, (err, hash) => {
    if (err) return next('HASH FUNCTION ERROR', err);

    const queryString = `INSERT INTO chatUsers (username, email, password)
      VALUES ($1, $2, '${hash}')
      RETURNING *`;
    const values = [username, email];
    db.query(queryString, values)
      .then((data) => {
        if (!data.rows[0]) return next({ message: 'nothing from database' });
        res.locals.user = data.rows[0]; // the userObj
        // invoke passport login
        return next();
      })
      .catch((err) => {
        console.log('error in createUser', err);
        return next({
          message: `error occured in creating new entry for user in userController.createUser, ERROR: ${err}`,
        });
      });
  });
};

module.exports = userController;
