CREATE TABLE chatUsers (
  _id SERIAL PRIMARY KEY,
  google_id VARCHAR UNIQUE,
  username VARCHAR,
  email VARCHAR UNIQUE,
  password VARCHAR
)

CREATE TABLE chatMessages (
  _id SERIAL PRIMARY KEY,
  content VARCHAR NOT NULL,
  created_by INT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP(0),
  FOREIGN KEY (created_by) REFERENCES chatUsers (_id)
)

CREATE TABLE chatMessages (
  _id SERIAL PRIMARY KEY,
  content VARCHAR NOT NULL,
  created_by VARCHAR NOT NULL, // the username of the poster
  user_id INT NOT NULL, //
  created_at DATE DEFAULT CURRENT_TIMESTAMP(0),
  FOREIGN KEY (user_id) REFERENCES chatUsers (_id)
)