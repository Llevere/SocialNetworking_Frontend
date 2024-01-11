import React, { useEffect, useState } from "react";
import "./ProfileCSS.css";
import axios from "axios";
import {
  Grid,
  Paper,
  ListItem,
  ListItemText,
  List,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RenderReplies from "./RenderReplies";

function formatDateWithMinute(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString(undefined, options);
}

function UserPosts({ posts, userId }) {
  const [post, setPost] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToDeleteContent, setPostToDeleteContent] = useState({});
  const [commentText, setCommentText] = useState({});

  const lightGreen = "#9dc183";
  const postNameFontSize = "24px";
  const commentNameFontSize = "22px";
  const replyNameFontSize = "20px";

  const handleOpenDeleteConfirmation = (postId, content, date) => {
    setPostToDelete(postId);
    setShowDeleteConfirmation(true);
    setPostToDeleteContent({ content, date });
  };

  const handleCloseDeleteConfirmation = () => {
    setPostToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeletePostConfirmation = async () => {
    try {
      const response = await axios.delete(`/post/delete`, {
        data: {
          postId: postToDelete,
          userId: userId,
        },
      });

      if (response.status === 204) {
        const filteredPosts = post.filter(
          (posts) => posts._id !== postToDelete
        );
        setPost(filteredPosts);

        handleCloseDeleteConfirmation();
      } else if (response.status === 200) {
        alert(
          "Post was not deleted. PostId and UserId matched. Something went wrong."
        );
      } else if (response.status === 401) {
        alert(JSON.stringify(response.message));
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handlePostReply = async (commentId, postId) => {
    // Send the replyText and commentId to the backend
    try {
      // console.log("Sending data over: "
      // + commentId, postId, userId, replyText)
      const response = await axios.post("/user/post/reply", {
        userId: userId,
        postId: postId,
        commentId: commentId,
        replyText: replyText,
      });

      if (response.status === 200) {
        // Reply successful, you can handle the response as needed
        // For example, update the UI to show the new reply
        setReplyingTo(null);
        setReplyText("");
        const data = response.data;
        setPost(data.post);
      } else {
        // Handle errors
        console.log("Not status 200: " + response.data.message);
      }
    } catch (error) {
      console.error("Request error:", error);
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else if (error.request) {
        console.error("Request Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    setPost(posts);
    // const fetchPosts = async () => {
    //   try {
    //     const response = await axios.get(`/user/post/${id}`);
    //     if (response.status === 200) {
    //       const data = response.data;
    //       setPost(data);
    //       setIsLoading(false);
    //     }
    //   } catch (error) {
    //     console.error("Request error:", error);
    //     if (error.response) {
    //       console.error("Response Status:", error.response.status);
    //       console.log("Response Data:", error.response.data);
    //     } else if (error.request) {
    //       console.error("Request Error:", error.request);
    //     } else {
    //       console.error("Error:", error.message);
    //     }
    //   }
    // };
    // fetchPosts();
  }, [posts]);

  // Function to toggle like status when the button is clicked
  const toggleLikeStatus = async (postId, commentId = "", replyId = "") => {
    const updatedPost = post.find((p) => p._id === postId);
    if (updatedPost) {
      const userLikedPost = updatedPost.likes.some(
        (like) => like.userId === userId
      );

      // If the user already liked the post, remove the like; otherwise, add the like
      if (userLikedPost) {
        updatedPost.likes = updatedPost.likes.filter(
          (like) => like.userId !== userId
        );
      } else {
        updatedPost.likes.push({ userId: userId });
      }

      try {
        const response = await axios.post(`/user/post/like`, {
          userId: userId,
          postId: postId,
        });
        if (response.status === 200) {
          //setUserLiked((prevUserLiked) => !prevUserLiked);
          // const data = response.data;
        } else {
          console.error("Request failed");
        }
      } catch (error) {
        console.error("Request error:", error);
        if (error.response) {
          console.error("Response Status:", error.response.status);
          console.log("Response Data:", error.response.data);
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
      // Update the post state
      setPost([...post]);
    }
  };

  //Likes for comments
  const postCommentLikeStatus = async (postId, commentId) => {
    const updatedPost = post.find((p) => p._id === postId);
    if (updatedPost) {
      const updatedComment = updatedPost.comments.find(
        (c) => c._id === commentId
      );
      if (updatedComment) {
        // var userLikedPostComment = '';
        // if(updatedComment.likes.length > 0)
        // {
        //   userLikedPostComment = updatedComment.likes.some((like) => like.userId === JSON.parse(User).id);
        // }
        var userLikedPostComment = false;
        try {
          userLikedPostComment = updatedComment.likes.some(
            (like) => like.userId === userId
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const response = await axios.post(`/user/post/like/comment`, {
            userId: userId,
            postId: postId,
            commentId: commentId,
          });
          if (response.status === 200) {
            if (userLikedPostComment) {
              updatedComment.likes = updatedPost.likes.filter(
                (like) => like.userId !== userId
              );
            } else {
              updatedComment.likes.push({ userId: userId });
            }
          } else {
            console.error("Request failed");
            alert("Something went wrong when liking a comment");
          }
        } catch (error) {
          console.error("Request error:", error);
          if (error.response) {
            console.error("Response Status:", error.response.status);
            console.log("Response Data:", error.response.data);
          } else if (error.request) {
            console.error("Request Error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        }
        // Update the post state
        setPost([...post]);
      }
    }
  };

  async function AddComment(userId, postId) {
    try {
      const response = await axios.post(`/user/post/comment`, {
        userId: userId,
        postId: postId,
        commentText: commentText[postId],
      });
      if (response.status === 200) {
        const data = response.data;
        console.log(data.comments);
        setPost(data.comments);
        //setCommentText('');
        setCommentText((prevCommentTexts) => ({
          ...prevCommentTexts,
          [postId]: "",
        }));
      } else {
        console.error("Request failed");
      }
    } catch (error) {
      console.error("Request error:", error);
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else if (error.request) {
        console.error("Request Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  function CommentTextChange(postId, e) {
    setCommentText((prevCommentTexts) => ({
      ...prevCommentTexts,
      [postId]: e.target.value,
    }));
  }

  const postReplyLikeStatus = async (postId, commentId, replyId) => {
    const updatedPost = post.find((p) => p._id === postId);
    if (updatedPost) {
      const updatedComment = updatedPost.comments.find(
        (c) => c._id === commentId
      );
      if (updatedComment) {
        const findReplyById = (reply, replyId, path = [], index = 0) => {
          try {
            const newPath = [...path, index]; // Add the current reply's _id to the path

            if (reply._id === replyId) {
              return { reply, path: newPath }; // Return the matched reply along with the path
            }

            for (let i = 0; i < reply.replies.length; i++) {
              const nestedReply = reply.replies[i];
              const result = findReplyById(nestedReply, replyId, newPath, i);

              if (result) {
                return result; // Return the result if a match is found in the nested replies
              }
            }
            console.log("Returning null.");
            return null; // Return null if no match is found
          } catch (error) {
            console.log("Error: " + error);
            return null;
          }
        };

        try {
          const reply = findReplyById(updatedComment, replyId);

          if (reply) {
            console.log("Matched Reply: ", reply.reply);
            console.log("Path: ", reply.path);

            try {
              const response = await axios.post("/user/post/like/reply", {
                userId: userId,
                postId: postId,
                commentId: commentId,
                replyId: replyId,
                path: reply.path,
              });

              if (response.status === 200) {
                try {
                  //console.log(reply.reply.likes);
                  const userLikedPostReplyIndex = reply.reply.likes.findIndex(
                    (like) => like.userId === userId
                  );

                  if (userLikedPostReplyIndex !== -1) {
                    // If the user has liked the reply, remove the like
                    reply.reply.likes.splice(userLikedPostReplyIndex, 1);
                    console.log("Removing the like.");
                  } else {
                    // If the user hasn't liked the reply, add the like
                    reply.reply.likes.push({ userId: userId });
                    console.log("Adding the like.");
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            } catch (error) {
              console.log("Error when liking/unliking a reply in a post.");
            }
          } else {
            console.log("Reply not found.");
          }
        } catch (error) {
          console.log("Error: " + error);
        }

        // Update the post state
        setPost([...post]);
      } else {
        console.log("Could not find comment when liking a reply.");
      }
    } else {
      console.log("Could not find post when liking a reply.");
    }
  };

  const renderReplies = (replies, commentId, postId) => {
    return (
      <div>
        {replies.map((reply, replyIndex) => (
          <ListItem
            key={replyIndex}
            style={{
              borderLeft: "2px solid #ccc",
              paddingLeft: "8px",
              marginTop: "1%",
              marginBottom: "1%",
            }}
          >
            <ListItemText
              primary={
                <h2
                  style={{
                    padding: 0,
                    margin: 0,
                    textTransform: "capitalize",
                    color: "black",
                  }}
                >
                  {reply.user.firstName}&nbsp;&nbsp;{reply.user.lastName}
                </h2>
              }
              secondary={
                <div>
                  <div style={{ marginBottom: "1%" }}>
                    Likes: {reply.likes.length}
                  </div>
                  <button
                    onClick={() =>
                      postReplyLikeStatus(postId, commentId, reply._id)
                    }
                    className={
                      reply.likes.some((like) => like.userId === userId)
                        ? "liked"
                        : ""
                    }
                  >
                    {/*post.likes.some((like) => like.userId === JSON.parse(User).id) ? 'Unlike' : 'Like'*/}
                    {reply.likes.some((like) => like.userId === userId)
                      ? "Unlike"
                      : "Like"}
                  </button>
                  <div style={{ margin: "2% 0 2% 0" }}>{reply.text}</div>
                  <div>{formatDateWithMinute(reply.dateCreated)}</div>
                  {replyingTo === reply._id ? (
                    <div>
                      {/* Input field for replying to the reply */}
                      <textarea
                        value={replyText}
                        style={{ resize: "none" }}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div>
                        <button
                          onClick={() => handlePostReply(reply._id, postId)}
                          disabled={replyText.length < 1}
                          style={{
                            backgroundColor:
                              replyText.length < 1 ? "" : lightGreen,
                          }}
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={handleCancelReply}
                          id="Post-Reply-Button-Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/*replyingTo === null && (
                    <button style={{ marginLeft: '1%', width: '12%', textAlign: 'center' }} onClick={() => handleReply(reply._id)}>Reply</button>
                  )*/}
                      <button
                        style={{
                          marginLeft: "1%",
                          marginTop: "1%",
                          width: "10%",
                          textAlign: "center",
                        }}
                        onClick={() => handleReply(reply._id)}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                  {reply.replies &&
                    reply.replies.length > 0 &&
                    renderReplies(reply.replies, commentId, postId)}
                </div>
              }
            />
          </ListItem>
        ))}
      </div>
    );
  };

  const updatePosts = (posts) => {
    setPost([...posts]);
  };

  const renderComments = (comments, postId) => {
    return (
      <div>
        {comments.map((comment) => (
          <ListItem
            key={comment._id}
            style={{
              borderLeft: "2px solid #ccc",
              paddingLeft: "8px",
              marginTop: "1%",
              marginBottom: "1%",
            }}
          >
            {/* Render comment content */}
            <ListItemText
              primary={
                <h2
                  style={{
                    padding: 0,
                    margin: 0,
                    textTransform: "capitalize",
                    color: "black",
                  }}
                >
                  {comment.user.firstName}&nbsp;&nbsp;{comment.user.lastName}
                </h2>
              }
              secondary={
                <div>
                  <div style={{ marginBottom: "1%" }}>
                    Likes: {comment.likes.length}
                  </div>
                  <button
                    onClick={() => postCommentLikeStatus(postId, comment._id)}
                    className={
                      comment.likes.some((like) => like.userId === userId)
                        ? "liked"
                        : ""
                    }
                  >
                    {comment.likes.some((like) => like.userId === userId)
                      ? "Unlike"
                      : "Like"}
                  </button>
                  <div>{comment.text}</div>
                  <div>{formatDateWithMinute(comment.dateCreated)}</div>

                  <button
                    onClick={() => handleReply(comment._id)}
                    style={{ width: "10%" }}
                  >
                    Reply
                  </button>

                  {replyingTo === comment._id ? (
                    <div style={{ marginTop: "5px" }}>
                      <textarea
                        value={replyText}
                        style={{ resize: "none" }}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div>
                        <button
                          onClick={() => handlePostReply(comment._id, postId)}
                          disabled={replyText.length < 1}
                          style={{
                            backgroundColor:
                              replyText.length < 1 ? "" : lightGreen,
                          }}
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={handleCancelReply}
                          id="Post-Reply-Button-Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {/* Render replies to this comment */}
                  {comment.replies &&
                    comment.replies.length > 0 &&
                    renderReplies(comment.replies, comment._id, postId)}
                </div>
              }
            />
          </ListItem>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "1%",
      }}
    >
      {post &&
        post.map((post, index) => (
          <div>
            <Paper
              id="Feed-Post-Content"
              key={index}
              elevation={3}
              sx={{
                margin: "8px",
                minWidth: "100%",
                width: "40vw",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {userId === post.userId && (
                <IconButton
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    zIndex: 1,
                  }}
                  onClick={() =>
                    handleOpenDeleteConfirmation(
                      post._id,
                      post.content,
                      post.dateCreated
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <ListItem>
                <ListItemText
                  primary={
                    <div>
                      <img
                        src={post.profilePicture}
                        alt="Profile Icon"
                        style={{
                          borderRadius: "50%",
                          marginRight: "10px",
                          width: "30px",
                          height: "30px",
                        }}
                      />
                      <div
                        style={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          color: "black",
                          fontSize: postNameFontSize,
                        }}
                      >
                        {post.firstName}&nbsp;&nbsp;{post.lastName}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          margin: "5px",
                        }}
                      >
                        {formatDateWithMinute(post.dateCreated)}
                      </div>
                    </div>
                  }
                  secondary={
                    <Typography
                      className="post"
                      variant="body1"
                      style={{
                        fontSize: "16px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      {post.content} {/* Potentially put this into a Paper */}
                    </Typography>
                  }
                />
              </ListItem>
              <div style={{ marginLeft: "1%" }}>
                <div style={{ marginBottom: "1%" }}>
                  Likes: {post.likes.length}
                </div>
                <button
                  onClick={() => toggleLikeStatus(post._id)}
                  className={
                    post.likes.some((like) => like.userId === userId)
                      ? "liked"
                      : ""
                  }
                >
                  {post.likes.some((like) => like.userId === userId)
                    ? "Unlike"
                    : "Like"}
                </button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "75%",
                  }}
                >
                  <textarea
                    placeholder="Add a comment"
                    style={{
                      resize: "none",
                      marginTop: "1%",
                      width: "50%",
                      padding: "1%",
                    }}
                    value={commentText[post._id] || ""}
                    onChange={(e) => CommentTextChange(post._id, e)}
                  />
                  <button
                    disabled={commentText[post._id] < 1}
                    style={{
                      width: "52.5%",
                      marginTop: "1%",
                      marginBottom: "1%",
                      backgroundColor:
                        commentText[post._id] < 1 ? "" : lightGreen,
                    }}
                    onClick={() => AddComment(userId, post._id)}
                  >
                    Comment
                  </button>
                  <div style={{ marginLeft: "1%" }}>
                    {post.comments &&
                      post.comments.length > 0 &&
                      renderComments(post.comments, post._id)}
                  </div>
                </div>
              </div>
            </Paper>
            <Modal
              open={showDeleteConfirmation}
              onClose={handleCloseDeleteConfirmation}
              aria-labelledby="delete-confirmation-title"
              aria-describedby="delete-confirmation-description"
            >
              <Paper id="PostDeletion">
                <Box>
                  <Typography variant="h6" id="delete-confirmation-title">
                    Confirm Deletion
                  </Typography>
                  <Typography
                    variant="body1"
                    id="delete-confirmation-description"
                  >
                    Are you sure you want to delete this post?
                  </Typography>
                  <Button
                    onClick={handleCloseDeleteConfirmation}
                    variant="contained"
                    id="deletePostButton"
                    className="cancelPost"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    id="deletePostButton"
                    className="deletePost"
                    onClick={handleDeletePostConfirmation}
                  >
                    Delete
                  </Button>
                </Box>
                <Paper>
                  {post && (
                    <div>
                      <Typography variant="body1" style={{ padding: "2%" }}>
                        Content to Delete:
                      </Typography>
                      <Typography className="post">
                        {postToDeleteContent.content}
                        <br />
                        <Typography
                          sx={{ backgroundColor: "#666" }}
                        ></Typography>
                        <Typography sx={{ right: 0, bottom: 0 }}>
                          {formatDateWithMinute(postToDeleteContent.date)}
                        </Typography>
                      </Typography>
                    </div>
                  )}
                </Paper>
              </Paper>
            </Modal>
          </div>
        ))}
    </div>
  );
}

export default UserPosts;
