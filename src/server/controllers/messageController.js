const db = require('../dbModel');

const messageController = {};

messageController.postMessage = (req, res, next) => {
  // console.log("post message req.body", req.body)
  const { created_by, content, created_at } = req.body;
  const SQLDate = created_at.slice(0, 19).replace('T', ' ');

  // create data for SQL syntax
  const query = `
  INSERT INTO public.messages ("author_id", "content", "created_at", "created_by")
  VALUES ($1, $2, $3, $4)
`;
  const values = [1, `${content}`, `${SQLDate}`, `${created_by}`];
  
  // send the new message to the DB
  db.query(query, values)
    .then((data) => {
      res.locals.messageAdded = true;
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
  const query = `SELECT * FROM "public"."messages" LIMIT 50`;

  db.query(query)
    .then((data) => {
      // console.log('data from message request: ', data)
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