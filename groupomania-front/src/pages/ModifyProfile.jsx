import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
    Grid,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link as RouteLink } from "react-router-dom";
import { getProfile, modifyProfile, modifyInfos } from "../redux/authSlice";





export default function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.auth);
    //const { id } = JSON.parse(localStorage.getItem("login"));

    useEffect(() => {
        dispatch(getProfile(id));
    }, [dispatch, id]);

    const handleSubmit = (e) => {
        console.log(newData)
        dispatch(modifyProfile(newData));

    };

    const handleSubmitPersonal = (e) => {
        console.log(newDataPersonal);
        dispatch(modifyInfos(newDataPersonal));
    };

    const [newData, setNewData] = useState({ bio: profile.bio, location: profile.location, id: id });
    const [newDataPersonal, setNewDataPersonal] = useState({ name: profile.name, handle: profile.handle, email: profile.email, id: id });


    return (<Box>
        <Box borderBottom="1px solid #ccc" padding="8px 20px">
            <Grid container alignItems="center">
                <Grid item sx={{ mr: "10px" }}>
                    <RouteLink to="/">
                        <IconButton>
                            <ArrowBackIcon />
                        </IconButton>
                    </RouteLink>
                </Grid>
            </Grid>
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "80%",
                    height: "80vh",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        onChange={(e) =>
                            setNewData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                        variant="outlined"
                        label="bio"
                        defaultValue={profile.bio}
                        type="bio"
                        required
                        name="bio"

                    />
                    <TextField
                        onChange={(e) =>
                            setNewData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                        variant="outlined"
                        label="localisation"
                        defaultValue={profile.location}
                        type="localisation"
                        required
                        name="location"

                    />



                    <Button
                        sx={{
                            width: "100%",
                            margin: "1.5rem 0",
                            padding: "12px 0",
                            borderRadius: "28px",
                        }}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >

                        Modifier mon profil

                    </Button>

                </form>

                <form onSubmit={handleSubmitPersonal}>
                    <TextField
                        onChange={(e) =>
                            setNewDataPersonal((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                        variant="outlined"
                        label="name"
                        defaultValue={profile.name}
                        type="name"
                        required
                        name="name"

                    />
                    <TextField
                        onChange={(e) =>
                            setNewDataPersonal((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                        variant="outlined"
                        label="handle"
                        defaultValue={profile.handle}
                        type="handle"
                        required
                        name="handle"

                    />
                    <TextField
                        onChange={(e) =>
                            setNewDataPersonal((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                        variant="outlined"
                        label="email"
                        defaultValue={profile.email}
                        type="email"
                        required
                        name="email"

                    />



                    <Button
                        sx={{
                            width: "100%",
                            margin: "1.5rem 0",
                            padding: "12px 0",
                            borderRadius: "28px",
                        }}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >

                        Modifier mes informations

                    </Button>

                </form>
            </Box>
        </Box>
    </Box>)
}