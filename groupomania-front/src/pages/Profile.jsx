import React, { useEffect } from "react";
import { Box } from "@mui/system";
import {
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProfile } from "../redux/authSlice";
import { Link as RouteLink } from "react-router-dom";
import { getFollowers, getFollowings } from "../redux/followSlice";
import format from "date-fns/format";

export default function Profile() {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.auth);
  //const { id } = JSON.parse(localStorage.getItem("login"));

  useEffect(() => {
    dispatch(getProfile(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (profile.userId) {
      dispatch(getFollowers(profile.userId._id));
      dispatch(getFollowings(profile.userId._id));
    }
  }, [dispatch, profile.userId]);



  

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
            <Grid item>
              <Typography variant="h6">
                {profile.userId && profile.userId && profile.userId.name}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#555" }}>
                {profile.posts && profile.posts.length} posts
              </Typography>{" "}
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
            <img
              width="100%"
              src={profile.backgroundImageUrl}
              alt="background"
            />
            <Box
              sx={{
                position: "absolute",
                top: 120,
                left: 15,
                background: "#eee",
                borderRadius: "50%",
              }}
            >
              <img width="150px" src={profile.profileImageUrl} alt="profile" />
            </Box>
          </Box>
          <Box textAlign="right" padding="10px 20px">
            <IconButton>
              <SettingsOutlinedIcon fontsize="medium" />
            </IconButton>
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
                <InsertLinkIcon htmlColor="#555" />
                <Link
                  sx={{ textDecoration: "none", marginLeft: "6px" }}
                  href={profile.website || "https:/google.com"}
                >
                  {profile.website ? profile.website : "www"}
                </Link>
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
              <Post key={post._id} post={post} profile={true} />
            ))}
        </Box>
      )}
    </Box>
  );
}
