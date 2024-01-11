import React, { useEffect, useState } from "react";
import axios from "axios";
import CoverProfile from "./CoverProfile";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./ProfileCSS.css";
import Logout from "../Logout";
import Images from "./Images";
import Friends from "./Friends";
import Posts from "./Posts";
import { Grid, Paper } from "@mui/material";
function Profile() {
  const [profileId, setProfileId] = useState("");
  const [doneLoading, setDoneLoading] = useState(false);
  const [userData, setUser] = useState({});
  const [userNotFound, setNoUserFound] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [usersProfile, setUsersProfile] = useState(false);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const [friendRequestsReceive, setFriendRequestsReceive] = useState([]);

  const navigate = useNavigate();

  const updateFriends = (newFriend) => {
    userData.friends.push(newFriend);
  };

  const updateFriendRequestsReceive = (updatedRequests) => {
    setFriendRequestsReceive(updatedRequests);
    userData.friendRequestsReceive = updatedRequests;
  };

  useEffect(() => {
    setRefresh(false);
    setUsersProfile(false);
    const url = window.location.href;
    // async function compareUsers() {
    //   if(localStorage.getItem("userId")){
    //     const userId = JSON.parse(window.localStorage.getItem('userId'));
    //     if(userId && userId.id)
    //     {
    //       // try {
    //       //   if(profileId){
    //       //   const response = await axios.get('/user/compareUsers', {
    //       //     userId: userId.id,
    //       //     profileId: profileId
    //       //   })

    //       //   if(response.status === 200)
    //       //   {
    //       //     setUsersProfile(response.data.usersProfile);
    //       //   }
    //       // }
    //       // } catch (error) {
    //       //   console.log("Error when searching for userId in useEffect")
    //       // }
    //     }
    //     else{
    //       setNoUserFound(true);
    //     }
    //   }
    //   else{
    //     setNoUserFound(true);
    //   }
    // }

    // Use substring to get the ID part after '='
    setProfileId(url.split("=")[1]);

    setDoneLoading(false);
    try {
      async function getUserData() {
        try {
          const response = await axios.get(`/user/profile/${profileId}`);

          if (response.status === 200) {
            setUser(response.data.userData);
            console.log(
              "User friends length: " + response.data.userData.friends.length
            );
          }
          if (response.status === 201) {
            setNoUserFound(true);
          }
        } catch (error) {
          console.log("Error in Profile.jsx getting user data: " + error);
        }
      }
      if (profileId) {
        getUserData();
        if (localStorage.getItem("userId")) {
          const userId = JSON.parse(window.localStorage.getItem("userId"));

          const getExistingFriendRequest = async () => {
            try {
              const response = await axios.get(
                `/existingFriends?profileId=${profileId}&userId=${userId.id}`
              );
              if (response.status === 200) {
                setAlreadyFriends(response.data.status);
              }
            } catch (error) {
              console.log(
                "Error in Profile.jsx getting user existing friends: " + error
              );
            }
          };

          if (userId && userId.id) {
            if (userId.id === profileId) {
              setUsersProfile(true);
            } else {
              setUsersProfile(false);
              getExistingFriendRequest();
            }
          } else {
            setNoUserFound(true);
          }
        } else {
          setNoUserFound(true);
        }
      }
    } catch (error) {
      console.log("Error in Profile.jsx: " + error);
    } finally {
      setDoneLoading(true);
    }
  }, [profileId, userNotFound, refresh]);

  const refreshData = () => {
    setRefresh(true);
  };

  function alreadyFriendsStatus(friends) {
    setAlreadyFriends(friends);
    console.log("Set already friends: " + friends);
  }

  function friendsListStatus(addToFriends, number) {
    //if addToFriends is true, add 'number' to friends, else subtract
    addToFriends ? (userData.friends += number) : (userData.friends -= number);
  }

  function friendRequestsReceiveStatus(addToRequests, number) {
    //if addToRequests is true, add 'number' to friendRequestReceive, else subtract
    addToRequests
      ? (userData.friendRequestsReceive += number)
      : (userData.friendRequestsReceive -= number);
  }

  // async function sendEmail(to = '', subject = '')  {
  //   const data = {
  //     to: 'MattsSocialProject@hotmail.com',
  //     subject: 'Reset Code',
  //   };

  //   try {
  //     const response = await axios.post('/sendEmail', data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error sending email from React:', error);
  //   }
  // };

  function setProfileData(profilePicture, profileHeader, userImages) {
    console.log("Image length: " + userData.images.length);
    setUser({
      ...userData,
      profileData: {
        profilePicture: profilePicture,
        profileHeader: profileHeader,
      },
      images: userImages,
    });

    console.log("Image length: " + userData.images.length);
  }

  function setUrlId(profileId) {
    setProfileId(profileId);
  }

  function updateImages(newImage) {
    setUser({
      ...userData,
      images: [...userData.images, newImage],
    });
  }

  return (
    <div>
      {!userNotFound && (
        <div>
          <SearchBar refresh={refreshData} />
          <Logout />
          {doneLoading && userData && (
            <div>
              <CoverProfile
                user={userData.profileData}
                firstName={userData.firstName}
                lastName={userData.lastName}
                usersProfile={usersProfile}
                friends={userData.friends}
                userId={profileId}
                alreadyFriends={alreadyFriends}
                friendRequestsReceive={userData.friendRequestsReceive}
                updateFriendRequestsReceive={updateFriendRequestsReceive}
                setAlreadyFriends={alreadyFriendsStatus}
                updateProfileData={setProfileData}
                updateFriends={updateFriends}
              />
              <Grid container sx={{ flexGrow: 1 }}>
                <Grid item className="Image-Friends-Grid">
                  <Images
                    userImages={userData.images}
                    userId={profileId}
                    isUserProfile={usersProfile}
                    updateImages={updateImages}
                    className="Grid-Images"
                  />
                  <Friends
                    userFriends={userData.friends}
                    setUrlId={setUrlId}
                    className="Grid-Friends"
                  />
                </Grid>
                <Grid sx={{ width: "50%", marginLeft: "5%" }}>
                  {profileId && (
                    <Posts className="Grid-Posts" profileId={profileId} />
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      )}
      {userNotFound && <div>No User Found.</div>}
    </div>
  );
}

export default Profile;
