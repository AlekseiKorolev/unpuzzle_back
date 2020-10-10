const { pool } = require("../util/dbConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");

const { convertCredentials } = require("./toCamelCase");

exports.jwtAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let email = "";

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    email = user.username;
  });

  pool.connect().then(db =>
    db
      .query(
        `SELECT id, handle, email, createdat, imageurl, bio, website, location FROM users WHERE email = $1`,
        [email]
      )
      .then(data => {
        db.release();
        if (data.rows.length === 0) {
          return res.status(404).json({ message: "User doesn't exist" });
        }
        req.user = convertCredentials(data.rows[0]);
        return next();
      })
      .catch(err => {
        console.log(err.stack);
        db.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );
};
