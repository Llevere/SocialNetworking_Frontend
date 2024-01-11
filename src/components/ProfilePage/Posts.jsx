import React, { useEffect, useState } from "react";
import "./ProfileCSS.css";
import axios from "axios";
import { Grid, Paper } from "@mui/material";
import UserPosts from "./UserPosts";

function Posts({ profileId }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem("userId")) {
        const id = JSON.parse(window.localStorage.getItem("userId"));
        setUserId(id.id);
      }
      const getUsersPostsByDate = async () => {
        try {
          const response = await axios.get(`/profile/posts/${profileId}`);

          if (response.status === 200) {
            console.log("200 Status from getUsersPostsByDate.");
            console.log(
              "User content: " + JSON.stringify(response.data.userPosts)
            );
            setPosts(response.data.userPosts);
          }
        } catch (error) {}
      };
      getUsersPostsByDate();
    } catch (error) {}
  }, [profileId]);

  return (
    <div id="Posts-OuterDiv">
      <Paper sx={{ width: "100%" }}>
        <Grid container>
          {/* Future Note: Either display there are no posts, or display nothing. */}
          {posts && posts.length > 0 && (
            <UserPosts posts={posts} userId={userId} />
          )}
        </Grid>
      </Paper>
    </div>
  );
}

export default Posts;
