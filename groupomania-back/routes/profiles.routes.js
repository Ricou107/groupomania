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
        db.query("SELECT * FROM posts WHERE authorId = ?", userId, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ err });
          } else {
            profile.posts = result;
            db.query("SELECT * FROM users WHERE id = ?", userId, (err, result) => {
              profile.handle = result[0].handle;
              profile.name = result[0].name;
              for (let i = 0; i < profile.posts.length; i++) {
                profile.posts[i].author = {}
                profile.posts[i].author.name = result[0].name;
                profile.posts[i].author.handle = result[0].handle; 
                profile.posts[i].author.createdAt = result[0].createdAt;
                profile.email = result[0].email;
              }
              db.query("SELECT * FROM profiles WHERE userId = ?", userId, (err, result) => {
                for (let i = 0; i < profile.posts.length; i++) {
                  profile.posts[i].author.profileImageUrl = result[0].profileImageUrl;
                }
              res.status(200).json({
                message: "Profile fetched successfully.",
                profile,
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
  /* try {
    const profileId = req.params.profileId;
    const updatedData = req.body;
    const profile = await Profile.findOneAndDelete(
      { _id: profileId },
      { ...updatedData },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
    });
  } */

  const updatedData = req.body;
  try {
    db.query("UPDATE profiles SET location = ?, bio = ?, profileimageUrl = ?, backgroundImageUrl = ?", [updatedData.location, updatedData.bio, updatedData.profileImageUrl, updatedData.backgroundImageUrl], (err, result) => {
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
});


module.exports = router;
