const express = require("express");
const db = require("../config/db");
const router = express.Router();
//const Comment = require("../models/comment.model");
//const Post = require("../models/post.model");

router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId
    db.query("SELECT *, comments.id as commentId FROM comments JOIN users ON (comments.authorId = users.id) JOIN profiles ON (comments.authorId = profiles.userId) WHERE comments.postId = ? ORDER BY commentCreatedAt DESC", postId, (err, result) => {
      res.status(200).json({
        message: "Comments fetched successfully.",
        response: { comments: result }
      });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

router.post("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const authorId = req.user.id;
    db.query("INSERT INTO comments (postId, authorId, comment) VALUES (?,?,?)", [postId, authorId, req.body.text])
    res.status(201).json({
      message: "Comment created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

router.delete("/:commentId", async (req, res) => {

  const commentId = req.params.commentId;
  try {
    db.query("SELECT * FROM comments WHERE id = ?", commentId, (err, result) => {
      if (result[0].authorId === req.user.id || req.user.id == 1) {
        db.query("DELETE FROM comments WHERE id = ?", commentId, (err, result) => {
          res.status(200).json({ message: "Le commentaire est supprimé." })
        })
      } else {
        res.status(400).json({ message: "Vous n'avez pas les droits pour supprimer ce commentaire." })
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }



});

module.exports = router;
