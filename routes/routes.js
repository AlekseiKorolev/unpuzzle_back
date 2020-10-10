const express = require("express");
const router = express.Router();

const { jwtAuth } = require("../util/jwtAuth");

const user = require("../handlers/users");
const pp = require("../handlers/puzzlepieces");

// puzzlepieces routes
router.get("/puzzlepieces", pp.getAllPuzzlepieces);
router.get("/puzzlepiece/:puzzlepieceId", pp.getPuzzlepiece);
router.get("/puzzlepiece/:puzzlepieceId/like", jwtAuth, pp.likePuzzlepiece);
router.get("/puzzlepiece/:puzzlepieceId/unlike", jwtAuth, pp.likePuzzlepiece);
router.post("/puzzlepiece", jwtAuth, pp.postPuzzlepiece);
router.post(
  "/puzzlepiece/:puzzlepieceId/comment",
  jwtAuth,
  pp.commentOnPuzzlepiece
);
router.delete("/puzzlepiece/:puzzlepieceId", jwtAuth, pp.deletePuzzlepiece);

// users routes
router.get("/user", jwtAuth, user.getUserData);
router.get("/user/:handle", user.getUserDetails);
router.post("/signup", user.signup);
router.post("/login", user.login);
router.post("/user", jwtAuth, user.addUserDetails);

module.exports = router;
