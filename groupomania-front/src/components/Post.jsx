import {
  Grid,
  IconButton,
  Input,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { addComment, deletePost, likeOrDislikePost } from "../api";
import { useDispatch } from "react-redux";
import { getPosts, updateLike } from "../redux/postSlice";
import Modal from "./Modal";
import { getProfile } from "../redux/authSlice";

export default function Post({ post, profile }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { id } = JSON.parse(localStorage.getItem("login"));
  
  const handleLike = async (e) => {
    e.preventDefault();
    dispatch(updateLike({ id: post.id }));
    const response = await likeOrDislikePost({ id: post.id });
    if (response.message !== "Post updated successfully.") {
      dispatch(updateLike({ id: post.id }));
    }
  };
  const handleAddComment = async () => {
    const response = await addComment({ id: post.id, text: commentText });
    if (response) {
      setCommentText("");
    }
  };

  const handleDeletePost = async () => {
    const response = await deletePost({ id: post.id });
    if (response) {
      if (profile) {
        dispatch(getProfile(post.author.id));
      } else {
        dispatch(getPosts());
      }
    }
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  return (
    <>
      <Link
        to={`/posts/${post.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          padding="1rem"
          sx={{
            "&:hover": {
              backgroundColor: "#eee",
            },
          }}
        >
          <Grid container flexWrap="nowrap">
            <Grid item sx={{ paddingRight: "1rem" }}>
              <Link to={`/profile/${post.authorId}`}>
                <img src={post.author.profileImageUrl} alt="lgoog" width="50px" />
              </Link>
            </Grid>
            <Grid item flexGrow="1">
              <Box>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="nowrap"
                >
                  <Grid item>
                    <Box display="flex">
                      <Typography
                        sx={{ fontSize: "16px", fontWeight: 500, mr: "6px" }}
                      >
                        {post.author.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                      >
                        @{post.author.handle}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                      >
                        .
                      </Typography>
                      <Typography
                        sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                      >
                        {formatDistanceToNow(new Date(post.createdAt))}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "15px", color: "#555" }}>
                        {post.text}
                      </Typography>
                    </Box>
                    {post.image !== null && (
                    <Box maxWidth = "500px">
                      <img
                        width="90%"
                        src={post.image}
                        alt="background"
                      />
                    </Box>
                    )}
                  </Grid>
                  <Grid item>
                    {(post.author.id === id || id === 1) && (
                      <IconButton
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(e);
                        }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    )}
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeletePost();
                        }}
                      >
                        Delete Post
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginRight="5rem"
                  marginTop=".8rem"
                  width="80px"
                >
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      handleModalOpen();
                    }}
                    size="small"
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>

                  <IconButton onClick={handleLike} size="small">
                    {post.isLiked ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>

                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Link>
      {openModal && (
        <Modal
          open={openModal}
          handleClose={handleModalClose}
          saveText={"Comment"}
          len={commentText.length}
          handleSave={handleAddComment}
        >
          <Box>
            <Grid container>
              <Grid item>
                <img src="/logo.png" alt="logo" width="60px" />
              </Grid>
              <Grid item flexGrow="1">
                <Box padding=".5rem 0">
                  <Input
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText}
                    multiline
                    rows="2"
                    disableUnderline
                    type="text"
                    placeholder="Post your comment"
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}
