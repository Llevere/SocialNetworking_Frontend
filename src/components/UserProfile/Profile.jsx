import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import NavbarProfile from './Navbar'
import CoverProfile from './CoverProfile'
import Posts from './Posts'
import Photos from './Photos'
import Friends from './Friends'
import { Paper } from '@mui/material';

function Profile() {
  //const navigate = useNavigate();
  const { state } = useLocation();
  const user = JSON.parse(state.user) || {};
  const [profileId, setProfileId] = useState('')
  const [doneLoading, setdoneLoading] = useState(false)
  
  const[profileChanges, setProfileChanges] = useState({});
  const[originalUserData, setUser] = useState({});
  const [navbarSettings, setNavbarSettings] = useState({});
  const [saveClicked, setSaveClicked] = useState(false);
  useEffect(() => {
    try {
      const currentUrl = window.location.href;
      var userId = currentUrl.substring(currentUrl.lastIndexOf('=') + 1);
      setProfileId(userId);


      async function getUserData() {
      try {
        const response = await axios.get(`/user/profile/${userId}`);
        if(response.status === 200) {
          setProfileChanges(JSON.stringify(response.data.userData));
          setUser(response.data.userData);
          setNavbarSettings(response.data.userData.navbarSettings)

        }
      } catch (error) {
        console.log("Error in Profile.jsx getting user data: " + error);
      }
    };
    getUserData();
    } catch (error) {
      console.log("Error in Profile.js: " + error);
    }
    finally{
      setdoneLoading(true);
    }



  }, [profileId]);
  
  // useEffect(() => {
  //   // This block of code will be executed whenever navbarSettings changes
    
  //   if(saveClicked)
  //   { 
  //     
  //   }
  // }, [navbarSettings,saveClicked]);

  const saveButton = (clicked) => {
    setSaveClicked(clicked);
    console.log("From Profile Save: " + JSON.stringify(navbarSettings))
  }
  const handleColourChange = async (colour) => {
    console.log("Colour change: " + colour);

     setNavbarSettings((prevSettings) => {
      // Combine the previous settings with the new colour
      const updatedSettings = {
        ...prevSettings,
        backgroundColour: colour,
      };
      return updatedSettings; 
    });
    console.log("COLOUR CHANGE: " + JSON.stringify(navbarSettings));
  } 

  const handleFontChange = (newFontFamily, newFontWeight) => {

    setNavbarSettings((prevSettings) => {
      // Combine the previous settings with the new colour
      const updatedSettings = {
        ...prevSettings,
        fontFamily: newFontFamily,
        fontWeight: newFontWeight
      };
      return updatedSettings; 
    });


  }


  // const handleSettingsChange = () => {
  //   console.log("Previous settings: " + JSON.stringify(navbarSettings))
  // //   console.log("Settings being sent back: " + JSON.stringify(settings));
  // //  // setNavbarSettings();
  // //  setNavbarSettings(settings)
    
  //   console.log("Navbar settings: " + JSON.stringify(navbarSettings))
  // }

  return (
    <div>
    
      {doneLoading && originalUserData && originalUserData.navbarSettings &&(
        
        <div >
        <h1>{navbarSettings.fontFamily} {navbarSettings.fontWeight}{navbarSettings.backgroundColour}</h1>
          <CoverProfile userId={profileId} user={originalUserData.profileImageData} />
          
          <NavbarProfile userId={profileId} user={originalUserData.navbarSettings} setColour={handleColourChange}
             saveButton={saveButton} setFontType={handleFontChange}
          />
          <Posts userId={profileId} />
          <Photos userId={profileId} user={originalUserData.images} />
          <Friends userId={profileId} user={originalUserData.friends} />
        </div>
        
      )}
    </div>
  );
  
}

export default Profile;
