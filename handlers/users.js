const { pool } = require("../util/dbConfig");
const bcrypt = require("bcrypt");

const {
  validateLoginData,
  validateSignupData,
  reduceUserDetails
} = require("../util/validators");
const { jwtGenerator } = require("../util/jwtGenerator");
const {
  convertLike,
  convertCredentials,
  convertPPMin
} = require("../util/toCamelCase");

module.exports.addUserDetails = (req, res) => {
  const userDetails = reduceUserDetails(req.body);
  pool.connect().then(db =>
    db
      .query(
        `UPDATE users SET bio = $1, website = $2, location = $3 WHERE id = $4`,
        [
          userDetails.bio,
          userDetails.website,
          userDetails.location,
          req.user.id
        ]
      )
      .then(() => {
        db.release();
        res.status(200).json({ message: "Details added successfully" });
      })
      .catch(err => {
        console.log(err);
        db.release();
        return res.status(500).json({ error: err.code });
      })
  );
};

module.exports.getUserDetails = async (req, res) => {
  let userData = {};
  userData.user = await pool.connect().then(db =>
    db
      .query(`SELECT * FROM users WHERE handle = $1`, [req.params.handle])
      .then(data => {
        db.release();
        if (data.rows.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
        return convertCredentials(data.rows[0]);
      })
      .catch(err => {
        console.log(err);
        db.release();
        return res.status(500).json({ error: err.code });
      })
  );

  userData.puzzlepieces = await pool.connect().then(db =>
    db
      .query(
        `SELECT * FROM puzzlepieces WHERE userhandle = $1 ORDER BY createdat DESC`,
        [req.params.handle]
      )
      .then(data => {
        db.release();
        const puzzlepieces = [];
        data.rows.forEach(row => {
          puzzlepieces.push(convertPPMin(row));
        });
        return puzzlepieces;
      })
      .catch(err => {
        console.log(err.stack);
        db.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );

  return res.status(200).json(userData);
};

module.exports.getUserData = async (req, res) => {
  let userData = { credentials: { ...req.user }, likes: [], notifications: [] };
  const email = req.user.email;

  userData.likes = await pool.connect().then(db =>
    db
      .query(`SELECT * FROM likes WHERE userid = $1`, [userData.credentials.id])
      .then(res => {
        db.release();
        const likes = [];
        res.rows.forEach(like => {
          likes.push(convertLike(like));
        });
        return likes;
      })
      .catch(err => {
        console.log(err.stack);
        db.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );

  userData.notifications = await pool.connect().then(notification =>
    notification
      .query(`SELECT * FROM notifications WHERE userid = $1`, [
        userData.credentials.id
      ])
      .then(res => {
        notification.release();
        return res.rows.length !== 0 ? res.rows : [];
      })
      .catch(err => {
        console.log(err.stack);
        notification.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );

  return res.status(200).json(userData);
};

module.exports.signup = async (req, res) => {
  const { email, password, confirmPassword, handle } = req.body;

  const { valid, errors } = validateSignupData({
    email,
    password,
    confirmPassword,
    handle
  });

  if (!valid) return res.status(400).json(errors);

  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    if (result.rows.length > 0) {
      return res.status(442).json({ message: "Email already registered" });
    } else {
      const createdat = new Date().toISOString();
      pool.query(
        `INSERT INTO users (handle, email, password, createdat)
          VALUES ($1, $2, $3, $4)
          RETURNING id`,
        [handle, email, hashedPassword, createdat],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Something went wrong" });
          }
          const token = jwtGenerator({ username: email });
          return res.status(201).json({ token });
        }
      );
    }
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  const { valid, errors } = validateLoginData({ email, password });

  if (!valid) return res.status(400).json(errors);

  pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.rows.length > 0) {
      const user = result.rows[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Something went wrong" });
        }
        if (isMatch) {
          const token = jwtGenerator({ username: email });
          return res.status(200).json({ token });
        } else {
          return res.status(403).json({ message: "Password is not correct" });
        }
      });
    } else {
      return res.status(401).json({ message: "Email is not registered" });
    }
  });
};
