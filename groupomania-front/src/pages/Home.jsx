import { CircularProgress, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/postSlice";
import AddPost from "../components/AddPost";

export default function Home() {
  const dispatch = useDispatch();
  const { status, posts } = useSelector((state) => state.post);
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const loginStorage = JSON.parse(localStorage.getItem("login"));

  return (
    <Box>
      <Box borderBottom="1px solid #ccc" padding="8px 20px">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
          <img src="/icon-left-font.png" alt="logo" width="200px"/>
          </Grid>
          {loginStorage.id === 1 && (<Grid fontWeight="bold"> Mode modérateur </Grid>)}
  
        </Grid>
      </Box>
      <Box height="92vh" sx={{ overflowY: "scroll" }}>
        <AddPost />
        <Box textAlign="center" marginTop="1rem">
          {status === "loading" && (
            <CircularProgress size={20} color="primary" />
          )}
        </Box>
        {status === "success" &&
          posts.map((post) => <Post key={post.id} post={post} />)}
      </Box>
    </Box>
  );
}
