import React, { useState, useRef, useEffect } from "react";
import { Button, Paper, Modal } from "@mui/material";
import Fade from "@material-ui/core/Fade";
import "./ProfileCSS.css";
import axios from "axios";

function CoverProfile({
  friendRequestsReceive,
  user,
  usersProfile,
  firstName,
  lastName,
  friends,
  userId,
  alreadyFriends,
  updateFriendRequestsReceive,
  setAlreadyFriends,
  updateProfileData,
  updateFriends,
}) {
  const [showUpdateWindow, setShowUpdateWindow] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState("Add Friend");
  const [friendRequestDelete, setFriendRequestDelete] = useState(null);
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const [tempStatus, setTempStatus] = useState(friendRequestStatus);
  const [showDeleteFriendConfirmation, setShowDeleteFriendConfirmation] =
    useState(false);
  const [existingFriends, setExistingFriends] = useState(false);
  const [alreadyFriendsStatus, setAlreadyFriendsStatus] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);

  const lightGreen = "#9dc183";
  // const postNameFontSize = "24px";
  //const commentNameFontSize = "22px";
  // const replyNameFontSize = "20px";
  const handleProfileClick = () => {
    // Toggle the visibility of the update window
    setShowUpdateWindow(!showUpdateWindow);
  };

  const hiddenFileInput = useRef(null);
  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // resolve(reader.result)
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the canvas dimensions to the desired size
          const maxWidth = 800; // Set your desired maximum width
          const maxHeight = 600; // Set your desired maximum height

          let width = img.width;
          let height = img.height;

          // Calculate the new dimensions while maintaining the aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Get the base64 representation of the compressed image
          const compressedBase64 = canvas.toDataURL("image/jpeg", 1.0); // Set the desired quality (0.8 is 80%)
          resolve(compressedBase64);
        };
      };
      reader.onerror = reject;
    });
  };

  useEffect(() => {
    setShowUpdateWindow(false);
    setShowHeaderOptions(false);
    console.log("Component mounted or dependencies changed");
    console.log("Friends length being sent over: " + friends);
    try {
      if (!usersProfile) {
        var _id = "";

        if (localStorage.getItem("userId")) {
          _id = window.localStorage.getItem("userId");
          const id = JSON.parse(_id).id;
          _id = id;
          //setUserId(id);
        }

        async function checkExistingFriends() {
          console.log("checkExistingFriends called");
          try {
            const response = await axios.get(
              `/findExistingFriend?friendId=${userId}&userId=${_id}`
            );

            if (response.status === 200) {
              console.log(
                "Existing friends is: " +
                  JSON.stringify(response.data.existingFriends)
              );
              setExistingFriends(response.data.existingFriends);
            }
          } catch (error) {
            console.log("Error when checking if existing friends: " + error);
          }
        }

        async function checkFriendRequestStatus() {
          console.log("checkFriendRequestStatus called");
          try {
            const response = await axios.get(
              `/findFriendRequest?addFriendID=${userId}&userId=${_id}`
            );

            if (response.status === 200) {
              //console.log(response.data.status);
              setFriendRequestStatus(response.data.status);
              setTempStatus(response.data.status);
              setFriendRequestDelete(response.data.delete);
            }
          } catch (error) {
            console.log("Error when checking friend request status: " + error);
          }
        }
        checkExistingFriends();
        checkFriendRequestStatus();
      }

      //Not inside users profile
      if (friends) {
        setFriendsList(friends);
      }
    } catch (error) {
      console.log("Error in useEffect in CoverProfile: " + error);
    }
  }, [friends, userId, usersProfile]);

  const handleUploadChange = async (event) => {
    const fileUploaded = event.target.files[0];
    const image = await convertBase64(fileUploaded);
    //console.log("Image: " + image)
    try {
      const response = await axios.post(`/upload/profilePicture`, {
        userId: userId,
        image: image,
      });

      if (response.status === 200) {
        console.log("200 status when posting image");
        updateProfileData(image, user.profileHeader, response.data.userImages);
        setShowUpdateWindow(false);
      }
    } catch (error) {}
  };

  const handleHeaderUploadChange = async (event) => {
    const fileUploaded = event.target.files[0];
    const image = await convertBase64(fileUploaded);
    try {
      const response = await axios.post(`/upload/profileHeader`, {
        userId: userId,
        image: image,
      });

      if (response.status === 200) {
        console.log("200 status when uploading profile header");
        updateProfileData(user.profilePicture, image, response.data.userImages);
        setShowHeaderOptions(false);
      }
    } catch (error) {}
  };

  const friendRequestStatusButton = async () => {
    var _id = "";

    if (localStorage.getItem("userId")) {
      _id = window.localStorage.getItem("userId");
      const id = JSON.parse(_id).id;
      _id = id;
    }
    // console.log("Id: " +_id)
    try {
      //setToggleModal(false);
      const response = await axios.post(`/addFriend`, {
        addFriendID: userId,
        userId: _id,
      });

      if (response.status === 200) {
        setFriendRequestStatus(response.data.status);
        setFriendRequestDelete(response.data.delete);
        setTempStatus(response.data.status);
      } else if (response.status === 201) {
        setFriendRequestStatus("ERROR ERROR: " + response.data.status);
      } else {
        console.log("Did not receive status 200.");
      }
    } catch (error) {
      console.log("Something happened adding a friend");
    }
  };

  const handleButtonPress = () => {
    // Add the "released" class and "fade-out" class when the button is pressed
    document.getElementById("add-friend-btn").classList.add("released");
  };

  const handleButtonRelease = () => {
    // Remove the "released" class and add the "fade-in" class when the button is released
    document.getElementById("add-friend-btn").classList.remove("released");
  };

  const showFriendRequests = () => {
    setShowFriendRequest(!showFriendRequest);
  };

  const deleteRequest = async (requestData) => {
    try {
      var _id = "";

      if (localStorage.getItem("userId")) {
        _id = window.localStorage.getItem("userId");
        const id = JSON.parse(_id).id;
        _id = id;
      }

      const response = await axios.post("/friendRequest/delete", {
        friendRequestData: requestData,
        userId: _id,
      });

      if (response.status === 200) {
        // console.log(`Friend Request ${requestData.firstName} ${requestData.lastName} accepted.`);
        // console.log("Friend Requests returned: " + JSON.stringify(response.data.friendRequests));

        // const updatedFriendRequests = friendRequestsReceive.filter(
        //   (request) => request._id !== requestData._id
        // );
        updateFriendRequestsReceive(response.status.friendRequests);
      }
    } catch (error) {
      console.log(
        "Something happened when accepting a friend request: " + error
      );
    }
  };

  const acceptRequest = async (requestData) => {
    try {
      var _id = "";

      if (localStorage.getItem("userId")) {
        _id = window.localStorage.getItem("userId");
        const id = JSON.parse(_id).id;
        _id = id;
      }

      const response = await axios.post("/friendRequest/accept", {
        friendRequestData: requestData,
        userId: _id,
      });

      if (response.status === 200) {
        console.log(
          `Friend Request ${requestData.firstName} ${requestData.lastName} accepted.`
        );
        console.log(
          "Friend Requests returned: " +
            JSON.stringify(response.data.friendRequests)
        );

        const updatedFriendRequests = friendRequestsReceive.filter(
          (request) => request._id !== requestData._id
        );
        updateFriendRequestsReceive(updatedFriendRequests);
        setFriendsList(response.data.allFriends);
        console.log(
          "Friend data being sent back: " +
            JSON.stringify(response.data.friendData)
        );
        updateFriends(response.data.friendData);
        //setAlreadyFriendsStatus(true);
        //setAlreadyFriends(true);
      }
    } catch (error) {
      console.log(
        "Something happened when accepting a friend request: " + error
      );
    }
  };

  const handleDeleteFriend = async () => {
    // Logic for deleting friend
    if (!usersProfile) {
      var _id = "";

      if (localStorage.getItem("userId")) {
        _id = window.localStorage.getItem("userId");
        const id = JSON.parse(_id).id;
        _id = id;
        //setUserId(id);
      }

      try {
        const response = await axios.delete("/deleteFriend", {
          data: {
            friendId: _id,
            userId: userId,
          },
        });

        if (response.status === 200) {
          console.log("200 status, changing to Add Friend.");
          setFriendRequestStatus("Add Friend");
          // setAlreadyFriendsStatus(false);
          // setAlreadyFriends(false);
          setExistingFriends(false);
          setFriendsList(response.data.updatedFriends);
          updateFriends(response.data.updatedFriends);
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    }

    // Close the modal after handling the delete action
    setShowDeleteFriendConfirmation(false);
  };

  const handleDeleteFriendClose = () => {
    // Close the modal without performing the action
    setShowDeleteFriendConfirmation(false);
  };

  const handleHeaderChange = () => {
    setShowHeaderOptions(!showHeaderOptions);
  };
  return (
    <div>
      <div style={{ padding: 0, margin: 0 }}>
        {user && (
          <div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                margin: 0,
                width: "100%",
              }}
            >
              <img
                id={usersProfile ? "CoverProfile-Header" : ""}
                onClick={usersProfile ? handleHeaderChange : null}
                src={user.profileHeader}
                style={{
                  height: "30vh",
                  width: "70%",
                  margin: 0,
                  borderRadius: "2.5rem",
                  padding: "1%",
                  objectFit: "fill",
                }}
                alt=""
              />

              <Modal
                open={showHeaderOptions}
                onClose={handleHeaderChange}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Paper
                  sx={{
                    width: "20%",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div>
                    <Button
                      onClick={handleUploadClick}
                      sx={{
                        marginRight: "10px",
                        backgroundColor: lightGreen,
                        "&:hover": {
                          backgroundColor: "#7e9a69", // Change the color on hover
                        },
                      }}
                      variant="contained"
                    >
                      Update Profile Header
                    </Button>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={hiddenFileInput}
                      onChange={handleHeaderUploadChange}
                    />
                    <Button
                      sx={{
                        marginLeft: "10px",
                        backgroundColor: "#C70000",
                        "&:hover": {
                          backgroundColor: "#9f0000", // Change the color on hover
                        },
                      }}
                      variant="contained"
                      onClick={() => setShowHeaderOptions(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Paper>
              </Modal>
              <div
                style={{
                  position: "absolute",
                  height: "15%",
                  left: "17%",
                  top: "35%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "65%",
                  }}
                >
                  <img
                    src={user.profilePicture}
                    style={{
                      height: "168px",
                      width: "168px",
                      borderRadius: "50%",
                      border: `5px solid bisque`,
                      cursor: usersProfile ? "pointer" : "default",
                      objectFit: "cover",
                    }}
                    alt=""
                    /*onClick={handleProfileClick}*/
                    onClick={usersProfile ? handleProfileClick : null}
                  />
                  {usersProfile && showUpdateWindow && (
                    <Paper
                      style={{
                        position: "absolute",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        padding: "20px",
                        width: "60%",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        zIndex: "999",
                        left: "33%",
                        marginTop: "150%",
                      }}
                    >
                      <p>Do you want to update your profile picture?</p>
                      <>
                        <button id="button-upload" onClick={handleUploadClick}>
                          Upload a file
                        </button>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={hiddenFileInput}
                          onChange={handleUploadChange}
                        />
                      </>
                      <button
                        id="button-upload"
                        onClick={() => setShowUpdateWindow(false)}
                      >
                        Cancel
                      </button>
                    </Paper>
                  )}
                  <div
                    style={{
                      marginLeft: "15%",
                      fontWeight: "bolder",
                      textTransform: "capitalize",
                      fontFamily: "Roboto",
                      marginTop: "15%",
                    }}
                  >
                    <h1>
                      {firstName}&nbsp;{lastName}
                    </h1>
                    <h3>Friends: {friendsList.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            {!usersProfile && !existingFriends && !alreadyFriendsStatus && (
              <div
                style={{ float: "right", marginRight: "25%", marginTop: "1%" }}
              >
                <button
                  id="add-friend-btn"
                  onClick={() => friendRequestStatusButton()}
                  onMouseOver={() => {
                    if (friendRequestDelete) {
                      setFriendRequestStatus("Delete Friend Request");
                    }
                  }}
                  onMouseOut={() => {
                    setFriendRequestStatus(tempStatus);
                  }}
                  onMouseDown={handleButtonPress}
                  onMouseUp={handleButtonRelease}
                >
                  {friendRequestStatus}
                </button>
              </div>
            )}

            {!usersProfile && existingFriends && alreadyFriends && (
              <div
                style={{ float: "right", marginRight: "25%", marginTop: "1%" }}
              >
                <button
                  id="delete-friend-btn"
                  onClick={() => setShowDeleteFriendConfirmation(true)}
                >
                  Delete Friend
                </button>
                <Modal
                  open={showDeleteFriendConfirmation}
                  onClose={handleDeleteFriendClose}
                >
                  <Fade in={showDeleteFriendConfirmation}>
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        width: "300px",
                        margin: "auto",
                        marginTop: "20%",
                      }}
                    >
                      <h2>Delete Friend</h2>
                      <p>Are you sure you want to delete this friend?</p>
                      <Button
                        onClick={handleDeleteFriendClose}
                        color="primary"
                        style={{ marginRight: "10px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteFriend}
                        color="primary"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </div>
                  </Fade>
                </Modal>
              </div>
            )}

            {usersProfile && (
              <div>
                <Button
                  variant="contained"
                  id="friend-requests"
                  onClick={showFriendRequests}
                >
                  Friend Requests &nbsp;
                  {friendRequestsReceive ? friendRequestsReceive.length : 0}
                </Button>
                {showFriendRequest && (
                  <Paper id="show-friend-requests">
                    <ul id="friendRequest-list">
                      {friendRequestsReceive &&
                      friendRequestsReceive.length > 0 ? (
                        friendRequestsReceive.map((friendRequest, index) => (
                          <li key={index}>
                            <img
                              src={friendRequest.profilePicture}
                              alt={`Profile of ${friendRequest.firstName}`}
                            />
                            <p>{friendRequest.dateSend}</p>
                            <span>
                              {friendRequest.firstName}&nbsp;&nbsp;
                              {friendRequest.lastName}
                            </span>
                            <button
                              onClick={() => acceptRequest(friendRequest)}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => deleteRequest(friendRequest)}
                            >
                              Delete
                            </button>
                            <button onClick={() => setShowFriendRequest(false)}>
                              Cancel
                            </button>
                          </li>
                        ))
                      ) : (
                        <div>
                          <h1 style={{ textAlign: "center", paddingTop: "5%" }}>
                            No Friend Requests
                          </h1>
                          <button
                            style={{
                              position: "absolute",
                              bottom: 0,
                              width: "100%",
                              height: "30px",
                            }}
                            onClick={() => setShowFriendRequest(false)}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </ul>
                  </Paper>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoverProfile;
