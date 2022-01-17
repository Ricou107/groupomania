import React, { useEffect, useRef } from "react";
import { Box } from "@mui/system";
import {
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Avatar from '@mui/material/Avatar';
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProfile } from "../redux/authSlice";
import { Link as RouteLink } from "react-router-dom";
import format from "date-fns/format";
import { modifyProfilePicture, modifyBackgroundPicture } from "../redux/authSlice";



export default function Profile() {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.auth);
  //const { id } = JSON.parse(localStorage.getItem("login"));
  const loginStorage = JSON.parse(localStorage.getItem("login"));

  useEffect(() => {
    dispatch(getProfile(id));
  }, [dispatch, id]);

  const inputFile = useRef(null)
  const onButtonClick = async () => {
    // `current` points to the mounted file input element

    inputFile.current.click()
  }

  const handleProfilePicture = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    formData.append('id', loginStorage.id);
    dispatch(modifyProfilePicture(formData));

    setTimeout(function () {
      dispatch(getProfile(id));
    }, 100);
  }
  
  const handleBackgroundPicture = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    formData.append('id', loginStorage.id);
    dispatch(modifyBackgroundPicture(formData));

    setTimeout(function () {
      dispatch(getProfile(id));
    }, 100);
  }


  return (
    <Box>
      <Box borderBottom="1px solid #ccc" padding="8px 20px">
        <Grid container alignItems="center">
          <Grid item sx={{ mr: "10px" }}>
            <RouteLink to="/">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </RouteLink>
          </Grid>

          {status === "success" && (
            <Grid item >

              <Typography sx={{ fontSize: "12px", color: "#555" }}>
                {profile.posts && profile.posts.length} posts
              </Typography>{" "}
              {loginStorage.id === 1 && (<Grid fontWeight="bold"> Mode modérateur </Grid>)}
            </Grid>
          )}
        </Grid>
      </Box>
      <Box textAlign="center">
        {status === "loading" && <CircularProgress size={20} color="primary" />}
      </Box>
      {status === "success" && (
        <Box height="90vh" sx={{ overflowY: "scroll" }}>
          <Box position="relative">
          <Button onClick={onButtonClick}
                  disabled={parseInt(loginStorage.id) !== parseInt(id)}
                >
                  <input type='file' id='file' name="image" ref={inputFile} style={{ display: 'none' }} accept="image/*"
                    onChange={(e) => {
                      handleBackgroundPicture(e);
                    }} />
                  <img
                    src={profile.backgroundImageUrl} alt="background" width="100%" />
                </Button>
            <Box
              sx={{
                position: "absolute",
                top: 120,
                left: 15,
                background: "#eee",
                borderRadius: "50%",
              }}
            >
              <Grid>
                <Button onClick={onButtonClick}
                  disabled={parseInt(loginStorage.id) !== parseInt(id)}
                >
                  <input type='file' id='file' name="image" ref={inputFile} style={{ display: 'none' }} accept="image/*"
                    onChange={(e) => {
                      handleProfilePicture(e);
                    }} />
                  <Avatar
                    sx={{ width: 150, height: 150 }}
                    src={profile.profileImageUrl} alt="profile" />
                </Button>
              </Grid>
            </Box>
          </Box>
          <Box textAlign="right" padding="10px 20px">
            <IconButton>
              <a href={"mailto:" + profile.email}><MailOutlineIcon /></a>

            </IconButton>

          </Box>
          <Box padding="10px 20px">
            <Typography variant="h6" sx={{ fontWeight: "500" }}>
              {profile.name}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#555" }}>
              @{profile.handle}
            </Typography>
            <Typography fontSize="16px" color="#333" padding="10px 0">
              {profile.bio}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              padding="6px 0"
              flexWrap="wrap"
            >
              <Box display="flex">
                <LocationOnIcon htmlColor="#555" />
                <Typography sx={{ ml: "6px", color: "#555" }}>
                  {profile.location}
                </Typography>
              </Box>

              <Box display="flex" marginLeft="1rem">
                <DateRangeIcon htmlColor="#555" />
                <Typography sx={{ ml: "6px", color: "#555" }}>
                  {
                    format(new Date(profile.createdAt), "MMM dd yyyy")}
                </Typography>
              </Box>
            </Box>

          </Box>
          <Box borderBottom="1px solid #ccc">
            <Typography
              display="inline-block"
              variant="caption"
              fontSize="16px"
              marginX="1rem"
              padding="6px 0"
              fontWeight="500"
              borderBottom={`4px solid ${theme.palette.primary.main}`}
            >
              Posts
            </Typography>
          </Box>
          {profile.posts &&
            profile.posts.map((post) => (
              <Post key={post.id} post={post} profile={true} />
            ))}
        </Box>
      )}
    </Box>
  );
}
