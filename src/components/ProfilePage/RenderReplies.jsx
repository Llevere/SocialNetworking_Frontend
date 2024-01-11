import React, { useEffect, useState } from "react";
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

function RenderReplies({
  post,
  userId,
  replies,
  commentId,
  postId,
  updatePosts,
}) {
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [posts, setPosts] = useState([]);

  const lightGreen = "#9dc183";
  const postNameFontSize = "24px";
  const commentNameFontSize = "22px";
  const replyNameFontSize = "20px";

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  useEffect(() => {
    if (post) {
      // console.log("post prop in RenderReplies:", post);
      setPosts(post);
    }
  }, [post]);

  const postReplyLikeStatus = async (postId, commentId, replyId) => {
    console.log("Entering Like Status Method.");
    //console.log("Being sent over: " + postId, commentId, replyId);
    //console.log("Posts length: " + JSON.stringify(posts));
    // if (!post || post.length === 0) {
    //   console.log("Post is undefined or empty.");
    //   console.log("Posts: " + posts);
    //   return;
    // }
    console.log(JSON.stringify(posts, null, 2));
    const updatedPost = posts.find((p) => p._id === postId);

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
              } else {
                console.log("Not getting status 200");
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
        // setPost([...post]);
        updatePosts(post);
      } else {
        console.log("Could not find comment when liking a reply.");
      }
    } else {
      console.log("Could not find post when liking a reply.");
    }
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
        //setPost(data.post);
        updatePosts(data.post);
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

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

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
                {reply.replies && reply.replies.length > 0 && (
                  <RenderReplies
                    userId={userId}
                    replies={reply.replies}
                    commentId={commentId}
                    postId={postId}
                    updatePosts={updatePosts}
                  />
                )}
              </div>
            }
          />
        </ListItem>
      ))}
    </div>
  );
}

export default RenderReplies;
