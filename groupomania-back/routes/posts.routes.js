const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const Like = require("../models/like.model");
const db = require('../config/db');


router.get("/", async (req, res) => {

  db.query("SELECT * FROM posts ORDER BY updatedAt DESC ", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });;
    } else {
      const posts = result

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
          res.status(200).json({ response: { posts: posts } })
        })
      })

    };
  })

});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const post = await Post.findOne({ _id: id }).populate("author").exec();
    if (post.likes.includes(userId)) {
      post.isLiked = true;
    }

    res.status(200).json({
      response: {
        post,
      },
      message: "Post fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  /*try {
    const author = {
      name: req.user.name,
      handle: req.user.handle,
      _id: req.user._id,
    };
    const post = await new Post({ author, ...req.body });
    post.author = author;
    await post.save();
    res.status(201).json({
      response: {
        post,
      },
      message: "Post created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  } */

  try {


    let authorId = req.user.id
    let text = req.body.text

    db.query("INSERT INTO posts (text, authorId, likes, comments, isLiked) VALUES (?,?,?,?,?)", [text, authorId, 0, 0, 1]);
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
    const userId = req.user._id;
    const id = req.params.id;
    const post = await Post.findOneAndDelete({ id, author: userId });
    if (!post) {
      res.status(404).json({
        message: "Post couldn't be found.",
      });
    }
    res.json({
      response: {
        post,
      },
      message: "Post deleted successfully",
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
    const userId = req.user._id;
    const post = await Post.findOne({ _id: req.body.id });
    if (!post) {
      return res.status(404).json({
        message: "Post couldn't be found.",
      });
    }
    const foundLike = await Like.findOne({ postId: post._id, author: userId });
    if (!foundLike) {
      post.isLiked = true;
      const newLike = await new Like({ postId: post._id, author: userId });
      await newLike.save();
      post.likes.push(newLike);
    } else {
      post.isLiked = false;
      await Like.findOneAndDelete({ postId: post._id, author: userId });
      const foundIndex = post.likes.indexOf(foundLike._id);
      post.likes.splice(foundIndex, 1);
    }

    await post.save();
    res.status(200).json({
      response: { post },
      message: "Post updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

module.exports = router;
