const express = require("express");
const router = express.Router();
//const Profile = require("../models/profile.model");
//const Post = require("../models/post.model");
const db = require('../config/db');

router.get("/:userId", async (req, res) => {

  const userId = req.params.userId;

  db.query("SELECT * FROM profiles WHERE userId = ?", userId, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });
    } else {
      if (result.length !== 1) {
        return res.status(401).json({ message: "Utilisateur non trouve !" });;
      } else {
        const profile = result[0]
        db.query("SELECT * FROM posts WHERE authorId = ? ORDER BY updatedAt DESC", userId, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ err });
          } else {
            profile.posts = result;
            db.query("SELECT * FROM users WHERE id = ?", userId, (err, result) => {
              profile.handle = result[0].handle;
              profile.name = result[0].name;
              profile.createdAt = result[0].createdAt
              for (let i = 0; i < profile.posts.length; i++) {
                profile.posts[i].author = {}
                profile.posts[i].author.name = result[0].name;
                profile.posts[i].author.handle = result[0].handle;
                profile.posts[i].author.id = result[0].id;
                profile.posts[i].author.createdAt = result[0].createdAt;
                profile.email = result[0].email;
              }
              db.query("SELECT * FROM profiles WHERE userId = ?", userId, (err, result) => {
                for (let i = 0; i < profile.posts.length; i++) {
                  profile.posts[i].author.profileImageUrl = result[0].profileImageUrl;
                }

                db.query("SELECT * FROM likes", (err, result) => {
                  for (let i = 0; i < profile.posts.length; i++) {
                    for (let j = 0; j < result.length; j++) {
                      if (req.user.id == result[j].authorId && profile.posts[i].id == result[j].postId) {

                        profile.posts[i].isLiked = 1;
                      }
                    }
                  }
                  res.status(200).json({
                    message: "Profile fetched successfully.",
                    profile,
                  });
                });
              });
            });
          }
        })
      }
    }
  });
});

router.put("/:profileId", async (req, res) => {

  const updatedData = req.body;
  console.log(updatedData)
  if (req.user.id == updatedData.id && req.user.id == req.params.profileId) {
    try {
      db.query("UPDATE profiles SET bio = ?, location = ? WHERE userId = ?", [updatedData.bio, updatedData.location, updatedData.id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ err });
        } else {
          res.status(200).json({
            message: "Profile updated successfully.",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Something went wrong.",
      });
    }
  } else { res.status(400).json({ message: "You can't do that" }) }


});


module.exports = router;
