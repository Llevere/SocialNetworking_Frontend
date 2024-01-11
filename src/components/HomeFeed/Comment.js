import React, {useState} from 'react'
import axios from 'axios'

  // Comment component
  function Comment({ postId, user }) {
    const userId = JSON.parse(user).id;
    // Add logic for handling comments

    const [commentText, setCommentText] = useState('')
     const [comments, setComments] = useState([]);

    async function AddComment() {
        try {
            const response = await axios.post(`/user/post/comment`,{
              userId: userId,
              postId: postId,
              commentText: commentText
          })
            if (response.status === 200) {
              const data = response.data;
              console.log(data.comments);
              setComments(data.comments);
              setCommentText('');
            } else {
              console.error('Request failed');
            }
          } catch (error) {
            console.error('Request error:', error);
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

    function CommentTextChange (event) {
        setCommentText(event.target.value);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
        <textarea
          placeholder="Add a comment"
          style={{ resize: 'none' }}
          value={commentText} // Bind the comment text to the textarea
          onChange={CommentTextChange}
        ></textarea>
        <button
          style={{ width: '33%' }}
          onClick={() => AddComment()} // Pass postId and commentText
          //disabled={commentText.length < 1}
        >
          Comment
        </button>
        {comments.map((comment, index) => (
  <div key={index}>
    <span>{comment.user.firstName} {comment.user.lastName}:</span>
    <span>{comment.text}</span>
    <span>{comment.dateCreated}</span>
  </div>
))}
      </div>
    );
  }

export default Comment