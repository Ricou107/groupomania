const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const Like = require("../models/like.model");

router.get("/", async (req, res) => {
  /*try {
    //const userId = req.user._id;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author")
      .exec();
    const updatedPosts = posts.map((post) => {
      if (true) {
        post.isLiked = true;
      }
      return post;
    });
    res.status(200).json({
      response: {
        posts: updatedPosts,
      },
      message: "Posts fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }*/

  res.status(200).json({
    response : {
      posts : [
        {
          _id: "61d7809e5d360082b17defca",
          text: "Test it out!",
          author: {
            _id: "61ae5f46c98bf7fb00a38b05",
            email: "tomato@mail.com",
            handle: "tomato",
            name: "Mr. Tomato",
            password: "$2b$10$D.hCCW3wvnUBTVjQigLZreeSYkfBSe9v0UI17/7JtgFaQeXHLIrEW",
            createdAt: "2021-12-06T19:06:46.883Z",
            updatedAt: "2021-12-06T19:06:46.883Z",
            __v: 0
          },
          likes: [
            "61dc2e15434cfdabe8c7ae0f"
          ],
          comments: [],
          isLiked: false,
          commentsCount: 0,
          likesCount: 0,
          createdAt: "2022-01-06T23:51:58.206Z",
          updatedAt: "2022-01-10T13:01:09.180Z",
          __v: 5
        }
      ]
    }
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
  try {
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
