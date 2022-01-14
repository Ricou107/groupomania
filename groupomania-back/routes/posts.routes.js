const express = require("express");
const router = express.Router();
//const Post = require("../models/post.model");
//const Like = require("../models/like.model");
const db = require('../config/db');
const multer = require('../middlewares/multer-config');
const fs = require('fs');




router.get("/", async (req, res) => {

  db.query("SELECT * FROM posts ORDER BY createdAt DESC ", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });;
    } else {
      let posts = result

      db.query("SELECT * FROM users", (err, result) => {
        let users = result

        for (let i = 0; i < posts.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (posts[i].authorId == users[j].id) {
              posts[i].author = users[j]
            }
          }
        }

        db.query("SELECT * FROM profiles", (err, result) => {
          for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < result.length; j++) {
              if (posts[i].authorId == result[j].userId) {
                posts[i].author.profileImageUrl = result[j].profileImageUrl
              }
            }
          }
          db.query("SELECT * FROM likes", (err, result) => {
            for (let i = 0; i < posts.length; i++) {
              for (let j = 0; j < result.length; j++) {
                if (req.user.id == result[j].authorId && posts[i].id == result[j].postId) {

                  posts[i].isLiked = 1;
                }
              }
            }


            res.status(200).json({ response: { posts: posts } })
          })
        })
      })

    };
  })

});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    db.query("SELECT * FROM posts where id = ? ", postId, (err, result) => {
      const post = result[0]

      db.query("SELECT * FROM users where id = ? ", post.authorId, (err, result) => {
        post.author = result[0]

        db.query("SELECT * FROM profiles where userId = ? ", post.authorId, (err, result) => {
          post.profileImageUrl = result[0].profileImageUrl

          db.query("SELECT * FROM likes", (err, result) => {
            for (let j = 0; j < result.length; j++) {
              if (req.user.id == result[j].authorId && post.id == result[j].postId) {
                post.isLiked = 1;
              }
            }
            res.status(200).json({
              response: {
                post,
              },
              message: "Post fetched successfully.",
            });
          });
        });
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

router.post("/", multer, async (req, res) => {

  
  try {

    let imageUrl = ''

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } else {
      imageUrl = null
    }
  
    let authorId = req.user.id
    let text = req.body.text

    db.query("INSERT INTO posts (text, authorId, likes, comments, isLiked, image) VALUES (?,?,?,?,?,?)", [text, authorId, 0, 0, 0, imageUrl]);
    res.status(201).json({
      message: "Post created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  } 
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    db.query("SELECT * FROM posts where id = ? ", postId, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err });;
      } else {
        if (userId == result[0].authorId) {
          db.query("DELETE FROM posts WHERE id = ? ", postId, (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ err });;
            } else {
              res.json({ message: "Post deleted successfully", result });
            }
          });
        } else {
          res.json({ message: "Vous n\avez pas les droits." })
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

// like and unlike a post
router.post("/likes", async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.body.id

    console.log(userId, postId)

    db.query(" SELECT EXISTS(SELECT 1 FROM likes WHERE postId= ? and authorId = ?)", [postId, userId], (err, result) => { 
      if (err) {
        console.log(err);
        return res.status(500).json({ err });;
      } else {
        if (Object.values(result[0])[0] == 1) {
          db.query("DELETE FROM likes WHERE authorId = ? AND postId = ?", [userId, postId], (err, result) => {
            db.query("UPDATE posts SET likes = likes - 1 WHERE id = ?", postId)
            res.status(200).json({
              response: { postId, userId },
              message: "Post updated successfully.",
            });
          })
        } else {
          db.query("INSERT INTO likes (authorId, postId) VALUES (?, ?)", [userId, postId], (err,result) => {
            db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", postId)
            res.status(200).json({
              response: { postId, userId },
              message: "Post updated successfully.",
            });
          })
        }
      }
    })
  

    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: { message: "Something went wrong." },
      error: error.message,
    });
  }
});

module.exports = router;
