import { Paper, Grid } from "@material-ui/core";
import React from "react";
import "./ProfileCSS.css";
import { useNavigate } from "react-router-dom";

function Friends({ userFriends, setUrlId }) {
  const navigate = useNavigate();

  // const displayedFriends = 5;
  const navigateToUser = (userId) => {
    navigate(`/profile/profile_id=${userId}`);
    setUrlId(userId);
  };
  return (
    <div id="Friends-OuterDiv">
      <h1>Friends</h1>
      {userFriends && userFriends.length > 0 ? (
        <Paper id="Friends-Paper">
          <Grid container spacing={2} id="Friends-OuterGrid">
            {userFriends &&
              /* userFriends.slice(0, displayedFriends).map((friend, index) => ( */
              userFriends.map((friend, index) => (
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={4}
                  key={index}
                  id="Friends-Grid"
                  onClick={() => {
                    navigateToUser(friend.user.userId);
                  }}
                >
                  <img
                    id="Friends-Img"
                    src={friend.profilePicture}
                    alt={`Img ${index}`}
                  />
                  <h4 id="Friends-FirstLastName">
                    {friend.user.firstName}&nbsp;{friend.user.lastName}
                  </h4>
                </Grid>
              ))}
          </Grid>
        </Paper>
      ) : (
        <Paper id="Friends-Paper">
          <div>No Friends</div>
        </Paper>
      )}
    </div>
  );
}

export default Friends;
