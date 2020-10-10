const { pool } = require("../util/dbConfig");

const { convertPP, convertComment } = require("../util/toCamelCase");

module.exports.likePuzzlepiece = async (req, res) => {
  const ppData = await pool.connect().then(db =>
    db
      .query(`SELECT * FROM puzzlepieces WHERE id = $1`, [
        req.params.puzzlepieceId
      ])
      .then(data => {
        db.release();
        if (data.rows.length === 0) {
          return res.status(404).json({ error: "Puzzle piece not found" });
        }
        return convertPP(data.rows[0]);
      })
      .catch(err => {
        console.log(err);
        db.release();
        return res.status(500).json({ err: err.code });
      })
  );

  const isLiked = await pool.connect().then(db =>
    db
      .query(
        `SELECT * FROM likes WHERE userhandle = $1 AND puzzlepieceid = $2`,
        [req.user.handle, req.params.puzzlepieceId]
      )
      .then(data => {
        db.release();
        return data.rows.length !== 0;
      })
      .catch(err => {
        console.log(err);
        db.release();
        return res.status(500).json({ err: err.code });
      })
  );

  if (isLiked) {
    ppData.likeCount = parseInt(ppData.likeCount) - 1;
    await pool.connect().then(db =>
      db
        .query(
          `DELETE FROM likes WHERE userhandle = $1 AND puzzlepieceid = $2`,
          [req.user.handle, req.params.puzzlepieceId]
        )
        .then(() => {
          db.release();
        })
        .catch(err => {
          console.log(err);
          db.release();
          return res.status(500).json({ err: err.code });
        })
    );
  } else {
    ppData.likeCount = parseInt(ppData.likeCount) + 1;
    await pool.connect().then(db =>
      db
        .query(
          `INSERT INTO likes (puzzlepieceid, userhandle, userid)
              VALUES ($1, $2, $3)`,
          [req.params.puzzlepieceId, req.user.handle, req.user.id]
        )
        .then(() => {
          db.release();
        })
        .catch(err => {
          console.log(err);
          db.release();
          res.status(500).json({ error: err.code });
        })
    );
  }

  pool.connect().then(db =>
    db
      .query(`UPDATE puzzlepieces SET likecount = $1 WHERE id = $2`, [
        ppData.likeCount,
        req.params.puzzlepieceId
      ])
      .then(() => {
        db.release();
        return res.json(ppData);
      })
      .catch(err => {
        console.log(err);
        db.release();
        return res.status(500).json({ error: err.code });
      })
  );
};

module.exports.deletePuzzlepiece = (req, res) => {
  pool.connect().then(db =>
    db
      .query(`SELECT * FROM puzzlepieces WHERE id = $1`, [
        req.params.puzzlepieceId
      ])
      .then(data => {
        if (data.rows.length === 0) {
          return res.status(404).json({ message: "PP not found" });
        }
        if (data.rows.userhandle !== req.user.userHandle) {
          return res.status(403).json({ error: "Unauthorized" });
        }
        db.query(`DELETE FROM puzzlepieces WHERE id = $1`, [
          req.params.puzzlepieceId
        ])
          .then(() => {
            db.release();
            res.json({ message: "Puzzle piece deleted. " });
          })
          .catch(err => {
            console.log(err);
            db.release();
            res.status(500).json({ err: err.code });
          });
      })
      .catch(err => {
        console.log(err);
        db.release();
        res.status(500).json({ err: err.code });
      })
  );
};

module.exports.commentOnPuzzlepiece = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newC = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    puzzlepieceId: req.params.puzzlepieceId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  pool.connect().then(db =>
    db
      .query(`SELECT * FROM puzzlepieces WHERE id = $1`, [
        req.params.puzzlepieceId
      ])
      .then(data => {
        if (data.rows.length === 0) {
          return res.status(404).json({ error: "PP not found" });
        }
        const commentCount = parseInt(data.rows[0].commentcount) + 1;
        db.query(`UPDATE puzzlepieces SET commentcount = $1 WHERE id = $2`, [
          commentCount,
          req.params.puzzlepieceId
        ])
          .then(() => {
            db.query(
              `INSERT INTO comments (body, createdat, puzzlepieceid, userhandle, userimage, userid)
           VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                newC.body,
                newC.createdAt,
                newC.puzzlepieceId,
                newC.userHandle,
                newC.userImage,
                req.user.id
              ]
            )
              .then(() => {
                db.release();
                return res.json(newC);
              })
              .catch(err => {
                console.log(err);
                db.release();
                return res.status(500).json({ error: "Something went wrong " });
              });
          })
          .catch(err => {
            console.log(err);
            com.release();
            return res.status(500).json({ error: "Something went wronf" });
          });
      })
      .catch(err => {
        console.log(err);
        com.release();
        return res.status(500).json({ error: "Something went wronf" });
      })
  );
};

module.exports.getPuzzlepiece = async (req, res) => {
  const puzzlepieceData = await pool.connect().then(db =>
    db
      .query(`SELECT * FROM puzzlepieces WHERE id = $1`, [
        req.params.puzzlepieceId
      ])
      .then(data => {
        db.release();
        if (data.rows.length === 0) {
          return res.status(404).json({ error: "Puzzle piece not found" });
        }
        return convertPP(data.rows[0]);
      })
      .catch(err => {
        console.log(err.stack);
        db.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );

  puzzlepieceData.comments = await pool.connect().then(com =>
    com
      .query(`SELECT * FROM comments WHERE puzzlepieceId = $1`, [
        req.params.puzzlepieceId
      ])
      .then(data => {
        com.release();
        const comments = [];
        data.rows.forEach(row => comments.push(convertComment(row)));
        return comments;
      })
      .catch(err => {
        console.log(err.stack);
        com.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );

  return res.json(puzzlepieceData);
};

module.exports.getAllPuzzlepieces = (req, res) => {
  pool.connect().then(pp =>
    pp
      .query(`SELECT * FROM puzzlepieces ORDER BY createdat DESC`)
      .then(data => {
        pp.release();
        const puzzlepieces = [];
        data.rows.forEach(row => {
          puzzlepieces.push(convertPP(row));
        });
        return res.json(puzzlepieces);
      })
      .catch(err => {
        console.log(err.stack);
        pp.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );
};

module.exports.postPuzzlepiece = async (req, res) => {
  if (req.body.body.trim() === "") {
    return res
      .status(400)
      .json({ body: "Puzzle Piece content must not be empty" });
  }

  const newPP = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageurl,
    ppType: req.body.ppType ? req.body.ppType : null,
    ppURL: req.body.ppURL ? req.body.ppURL : null,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    userId: req.user.id
  };

  const puzzlepieceId = await pool.connect().then(puzzle =>
    puzzle
      .query(
        `INSERT INTO puzzlepieces (body, userhandle, userimage, pptype, ppurl, createdat, likecount, commentcount, userid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          newPP.body,
          newPP.userHandle,
          newPP.userImage,
          newPP.ppType,
          newPP.ppURL,
          newPP.createdAt,
          newPP.likeCount,
          newPP.commentCount,
          newPP.userId
        ]
      )
      .then(data => {
        puzzle.release();
        newPP.puzzlepieceId = data.rows[0].id;
        return res.json(newPP);
      })
      .catch(err => {
        console.log(err.stack);
        puzzle.release();
        return res.status(500).json({ message: "Something went wrong" });
      })
  );
};
