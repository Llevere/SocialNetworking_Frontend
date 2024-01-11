import React from 'react'
import { useNavigate } from 'react-router-dom'

function Friends({userId, user}) {

  const navigate = useNavigate();

  const navigateLink = (id) => {
    //navigate(`/profile/profile_id=${id}`, {state: {user: user}});
  }
  return (
    <div>
    <h2>Friends</h2>
    <ul>
      {user.map((friend, index) => (
        {/* <li key={index} onClick={navigateLink(friend._id)}>{friend.firstName}{' '}{friend.lastName}</li> */}
        // Replace `{friend}` with the property you want to display
      ))}
    </ul>
  </div>
  )
}

export default Friends