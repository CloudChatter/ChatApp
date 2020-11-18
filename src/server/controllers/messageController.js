const db = require('../dbModel');

const messageController = {};

messageController.postMessage = (req, res, next) => {
  const { id, author_id, content, created_at } = req.body;

  const query = `
  INSERT INTO Messages (message_id, message, created_at)
  VALUES ($1, $2, $3, $4)
`;
  const values = [id, author_id, content, created_at];
  db.query(query, values)
    .then((data) => {
      console.log(data);
      return next();
    })
    .catch((err) => {
      return next({
        log: "Could not add message. Check query syntax.",
        message: { error: err },
      });
    });
};

messageController.getMessages = (req, res, next) => {
  const query = `SELECT * FROM Messages`;

  db.query(query)
    .then((data) => {
      res.locals.messages = data.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: "Could not get messages. Check query syntax.",
        message: { error: err },
      });
    });
};


module.exports = messageController;