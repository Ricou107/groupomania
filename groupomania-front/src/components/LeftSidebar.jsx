import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import {
  Button,
  Grid,
  Hidden,
  IconButton,
  Input,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import { getPosts } from "../redux/postSlice";
import { addPost } from "../api";

export default function LeftSidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id } = JSON.parse(localStorage.getItem("login"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const [postText, setPostText] = React.useState("");
  const [postImage, setPostImage] = React.useState("");


  const handleAddPost = async () => {
    const formData = new FormData()
    formData.append('image', postImage)
    formData.append('text', postText)
      
      const data = await addPost(formData);
    if (data) {
      dispatch(getPosts());
      setPostText("");
      setPostImage("");
    }
  };

  return (
    <>
      <Box sx={{ height: "100vh", maxWidth: "100%" }}>
        <Box textAlign="center" marginTop="10px">
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <img src="/logo.png" alt="logo" width="40px" />
          </NavLink>
        </Box>
        <List>
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "28px",
                margin: ".5rem 0",
              }}
            >
              <ListItemIcon>
                <HomeIcon fontSize="medium" color="action" />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color: theme.palette.action.active,
                  }}
                  primary="Home"
                />
              </Hidden>
            </ListItem>
          </NavLink>


          <NavLink
            to={`/profile/${id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "28px",
                margin: ".5rem 0",
              }}
            >
              <ListItemIcon>
                <PersonOutlineIcon fontSize="medium" color="action" />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color: theme.palette.action.active,
                  }}
                  primary="Profile"
                />
              </Hidden>
            </ListItem>
          </NavLink>
          <ListItem
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            button
            sx={{
              borderRadius: "28px",
              margin: ".5rem 0",
            }}
          >
            <ListItemIcon>
              <MoreHorizIcon fontSize="medium" color="action" />
            </ListItemIcon>
            <Hidden lgDown>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "18px",
                  color: theme.palette.action.active,
                }}
                primary="More"
              />
            </Hidden>
          </ListItem>
        </List>
        <Hidden lgDown>
          <Button
            onClick={handleModalOpen}
            
            variant="contained"
            color="primary"
            fullWidth
            style={{
              borderRadius: "28px",
              padding: "10px",
              textTransform: "capitalize",
            }}
          >
            Post
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            onClick={handleModalOpen}
            variant="contained"
            color="primary"
            style={{
              borderRadius: "28px",
              padding: "0 15px",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Hidden>
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
            onClick={() => {
              dispatch(logout());
              handleClose();
            }}
          >
            Logout
          </MenuItem>
          <NavLink
            to={`/modifyProfile/${id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
          <MenuItem
            onClick={() => {
              handleClose();
            }}
          >
            Modifier son profil
          </MenuItem>
          </NavLink>
        </Menu>
      </Box>
      {openModal && (
        <Modal
          open={openModal}
          handleClose={handleModalClose}
          saveText={"Post"}
          len={postText.length}
          leni={postImage.length}
          handleSave={handleAddPost}
        >
          <Box>
            <Grid container>
              <Grid item>
                <img src="/logo.png" alt="logo" width="60px" />
              </Grid>
              <Grid item flexGrow="1">
             
                <Box padding=".5rem 0">
                  <Input
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    multiline
                    rows="2"
                    disableUnderline
                    type="text"
                    placeholder="What's happening?"
                    sx={{ width: "100%" }}
                  />
                   <Box
            >
            <Input 
            type="file" 
            name="file" 
            disableUnderline
            title="Ajoutez une image !"
            onChange={(e) => setPostImage(e.target.files[0])}/>
            </Box>
            {postImage !== '' ? <img src={URL.createObjectURL(postImage)} alt="uploadedPicture"/> : "" }
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}
