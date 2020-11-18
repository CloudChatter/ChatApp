const db = require('../dbModel');

const messageController = {};

messageController.postMessage = (req, res, next) => {
  console.log("post message req.body", req.body)
  const { created_by, content, created_at } = req.body;
  const SQLDate = created_at.slice(0, 19).replace('T', ' ');
  console.log("SQLDate", SQLDate)
  const query = `
  INSERT INTO public.messages ("author_id", "content", "created_at", "created_by")
  VALUES ($1, $2, $3, $4)
`;
  const values = [1, `${content}`, `${SQLDate}`, `${created_by}`];
  db.query(query, values)
    .then((data) => {
      console.log("DB response data:", data);
      return next();
    })
    .catch((err) => {
      console.log('error in postMessage:', err)
      return next({
        log: "Could not add message. Check query syntax.",
        message: { error: err },
      });
    });
};

messageController.getMessages = (req, res, next) => {
  console.log('get messages route fired')
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