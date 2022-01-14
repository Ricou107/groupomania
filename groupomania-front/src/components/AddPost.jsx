import { Button, Grid, Input } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../api";
import { getPosts } from "../redux/postSlice";

export default function AddPost() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");

  const handleAddPost = async () => {
    URL.revokeObjectURL(postImage)
    const formData = new FormData()
    formData.append('image', postImage)
    formData.append('text', postText)
      
      const data = await addPost(formData);
      if (data) {
        dispatch(getPosts());
        setPostText("");
        setPostImage("");
      } 
    }


   
  return (
    <Box padding="1rem 1rem 0 1rem" borderBottom="1px solid #ccc">
      <Grid container>
        <Grid item sx={{ paddingRight: "1rem" }}>
          <img src="/logo.png" alt="lgogo" width="50px" />
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
              placeholder="Quoi de beau chez Groupomania ?"
              sx={{ width: "100%" }}
            />
          </Box>
          <Box
            textAlign="right"
            paddingBottom=".5rem"
            paddingTop=".5rem"
            borderTop="1px solid #ccc"
          >
            <Box
            >
            <Input 
            type="file" 
            name="file" 
            disableUnderline
            title="Ajoutez une image !"
            onChange={(e) => {
            setPostImage(e.target.files[0]);
            }}/>
            </Box>
            <Button
              onClick={handleAddPost}
              disabled={postText.length === 0 && postImage.length === 0}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: theme.shape.borderRadius,
                fontSize: "12px",
              }}
            >
              Post
            </Button>
          </Box>
          {postImage !== '' ? <img src={URL.createObjectURL(postImage)} alt="uploadedPicture"/> : "" }
        </Grid>
      </Grid>
    </Box>
  );
}
