// import React from 'react'
// import axios from 'axios';
// import { ListItem, ListItemText } from '@mui/material';
// function RenderReplies({replies, commentId, postId, User, post}) {


//     const postReplyLikeStatus = async (postId, commentId, replyId) => {
//     const updatedPost = post.find((p) => p._id === postId);
//     if(updatedPost){
//     const updatedComment = updatedPost.comments.find((c) => c._id === commentId);
//     if (updatedComment) {
     
//       const findReplyById = (reply, replyId, path = [], index = 0) => {
//         try {
//           const newPath = [...path, index]; // Add the current reply's _id to the path
      
//           if (reply._id === replyId) {
//             return { reply, path: newPath }; // Return the matched reply along with the path
//           }
      
//           for (let i = 0; i < reply.replies.length; i++) {
//             const nestedReply = reply.replies[i];
//             const result = findReplyById(nestedReply, replyId, newPath, i);
      
//             if (result) {
//               return result; // Return the result if a match is found in the nested replies
//             }
//           }
//           console.log("Returning null.");
//           return null; // Return null if no match is found
//         } catch (error) {
//           console.log("Error: " + error);
//           return null;
//         }
//       };
      
//       try {
//         const reply = findReplyById(updatedComment, replyId);

//         if (reply) {
//           console.log("Matched Reply: ", reply.reply);
//           console.log("Path: ", reply.path);

//           try {
//             const response = await axios.post('/user/post/like/reply',
//             {
//               userId: JSON.parse(User).id,
//               postId: postId,
//               commentId: commentId,
//               replyId: replyId,
//               path: reply.path
//             })

//             if(response.status === 200)
//             {
//               try {
//                 //console.log(reply.reply.likes);
//                 const userLikedPostReplyIndex = reply.reply.likes.findIndex((like) => like.userId === JSON.parse(User).id);
              
//                 if (userLikedPostReplyIndex !== -1) {
//                   // If the user has liked the reply, remove the like
//                   reply.reply.likes.splice(userLikedPostReplyIndex, 1);
//                   console.log("Removing the like.")
//                 } else {
//                   // If the user hasn't liked the reply, add the like
//                   reply.reply.likes.push({ userId: JSON.parse(User).id });
//                   console.log("Adding the like.")
                
//                 }
//               } catch (error) {
//                 console.error(error);
//               }
//             }
//           } catch (error) {
//             console.log("Error when liking/unliking a reply in a post.")
//           }
//         } else {
//           console.log("Reply not found.");
//         }
//       } catch (error) {
//         console.log("Error: "  + error);
//       }
      
//       // Update the post state
//       setPost([...post]);
//     }
//     else{
//       console.log("Could not find comment when liking a reply.")
//     }
//   }
//   else{
//     console.log("Could not find post when liking a reply.")
//   }
// };


//   return (
//     <div>
//       {replies.map((reply, replyIndex) => (
//         <ListItem key={replyIndex} style={{ borderLeft: '2px solid #ccc', paddingLeft: '8px', marginTop: '1%', marginBottom: '1%' }}>

//           <ListItemText
//             primary={<h2 style={{padding: 0, margin: 0, textTransform: 'capitalize'}}>{reply.user.firstName}&nbsp;&nbsp;{reply.user.lastName}</h2>}
//             secondary={
//               <div>
//                 <div style={{ marginBottom: '1%'}}>
//                   Likes: {reply.likes.length} 
//                 </div>
//                 <button
//                   onClick={() => postReplyLikeStatus(postId, commentId, reply._id)}
//                   className={reply.likes.some((like) => like.userId === JSON.parse(User).id) ? 'liked' : ''}
//                  >
//                 {/*post.likes.some((like) => like.userId === JSON.parse(User).id) ? 'Unlike' : 'Like'*/}
//                 {reply.likes.some((like) => like.userId === JSON.parse(User).id) ? 'Unlike' : 'Like'}
//                 </button>
//                 <div>{reply.text}</div>
//                 <div>{reply.dateCreated}</div>
//                 {replyingTo === reply._id ? (
//                   <div>
//                     {/* Input field for replying to the reply */}
//                     <textarea
//                       value={replyText}
//                       style={{ resize: 'none' }}
//                       onChange={(e) => setReplyText(e.target.value)}
//                     />
//                     <button onClick={() => handlePostReply(reply._id, postId)}
//                     disabled={replyText.length < 1}>Post Reply</button>
//                     <button onClick={handleCancelReply}>Cancel</button>
//                   </div>
//                 ) : (
                  
//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   {replyingTo === null && (
//                     <button style={{ marginLeft: '1%', width: '12%', textAlign: 'center' }} onClick={() => handleReply(reply._id)}>Reply</button>
//                   )}
//                   </div> 
//                 )}
//                 {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies, commentId, postId)}
//               </div>
//             }
//           />
//         </ListItem>
//       ))}
//     </div>
//   )
// };



// export default RenderReplies