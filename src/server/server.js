require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/build', express.static(path.join(__dirname, '../../build')));

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
  });

  app.use(({ code, error }, req, res, next) => {
    res.status(code).json({ error });
  });
}

console.log(process.env.PG_URI);

module.exports = app.listen(port, () =>
  console.log(`Listening on port ${port}`)
);
