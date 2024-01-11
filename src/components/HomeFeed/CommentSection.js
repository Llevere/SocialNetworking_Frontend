import React from 'react'

function CommentSection(post) {
  return (
    <div>
      <h3>Comments:</h3>
      <ul>
        {post.comments.map((comment, index) => (
          <li key={index}>
            <div>{comment.user.firstName} {comment.user.lastName}</div>
            <p>{comment.text}</p>
            <p>{comment.dateCreated}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommentSection