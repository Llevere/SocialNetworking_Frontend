import axios from 'axios';
import React, { useEffect, useState } from 'react'
function CoverProfile({userId, user}) {

  const [headerImage, setHeader] = useState(user.profileHeader);
  const [profileImage, setProfilePicture] = useState(user.profilePicture);
  const [doneLoading, setDoneLoading] = useState(false);
  const [borderColour, setBorderColour] = useState(user.profileBorderColour);


  // useEffect(() => { 

  //   // Fetch background color and set it in the state
  //   async function fetchBorderColour() {
  //     try {
  //       const response = await axios.get(`/upload/profileBorderColour/${userId}`);
  //       if (response.status === 200) {
  //         setBorderColour(response.data.backgroundColour); // Set border color to match the background color
          
  //       }
  //     } catch (error) {
  //       console.error('Error fetching background colour:', error);
  //     }
  //   }
  //   async function profileData ()
  //   {
  //   try {
  //     const response = await axios.get(`/profileImages/${userId}`);

  //     if(response.status === 200)
  //     {
  //         setHeader(response.data.images.profileHeader);
  //         setProfilePicture(response.data.images.profilePicture);
  //     }
  //   } catch (error) {
      
  //   }
  //   fetchBorderColour();
  // }
  // profileData();
  // }, [userId, borderColour]);


  return (
    <div style={{padding: 0, margin: 0}}>
    {<div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}>
      
      <img src={headerImage} style={{ height: '30vh', width: '60%', margin: 0, display: 'block', borderRadius: '1.5rem' ,
      padding: '1%'}} alt='' />
      </div>
      <div style={{ position: 'absolute', height: '10rem',left: '25%', padding: 0, margin: 0, display: 'flex', justifyContent: 'center',
      alignContent: 'center', top: '25%', zIndex: 0}}>
        <img
          src={profileImage}
          style={{
            borderRadius: '50%',
            border: `5px solid ${borderColour}`,
            transition: 'border-color 1.0s ease-in-out',
          }}
          alt=''
        />
      </div>
    </div>

}
    
    </div>
  );
}

export default CoverProfile

