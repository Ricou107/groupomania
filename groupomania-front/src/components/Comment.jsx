import { Grid, Typography, IconButton, Menu,
  MenuItem, } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { parseDate } from "../utils/parseDate";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { deleteComment } from "../api";
import { useDispatch } from "react-redux";
import { getComments } from "../redux/postSlice";





export default function Comment({ comment }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { id } = JSON.parse(localStorage.getItem("login"));
  const dispatch = useDispatch();



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  const handleDeletePost = async () => {
    console.log('ok')
    const response = await deleteComment({commentId : comment.commentId });
    if (response) {dispatch(getComments(comment.postId));}

  };

  return (
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
          <img src={comment.profileImageUrl} alt="lgoog" width="50px" />
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
                    {comment.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                  >
                    @{comment.handle}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                  >
                    .
                  </Typography>
                  <Typography
                    sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                  >
                    {parseDate(comment.commentCreatedAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "15px", color: "#555" }}>
                    {comment.comment}
                  </Typography>
                </Box>
                <Grid item>
                    {(comment.authorId === id || id === 1) && (
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
                        Delete Comment
                      </MenuItem>
                    </Menu>
                  </Grid>
              </Grid>
              {/*<Grid item>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Grid>*/}
            </Grid>
            {/* <Box
                display="flex"
                justifyContent="space-between"
                marginRight="5rem"
                marginTop=".8rem"
              >
                <IconButton size="small">
                  <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <SyncIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  {comment.isLiked ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
                <IconButton size="small">
                  <IosShareIcon fontSize="small" />
                </IconButton>
              </Box> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
