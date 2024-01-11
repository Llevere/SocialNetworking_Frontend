import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FontSelector from './FontSelector.jsx';


function NavbarProfile({userId, user, setColour, setFontType, saveButton}) {
  const originalColour = user.backgroundColour;
  const [selectedColour, setSelectedColor] = useState(user.backgroundColour);
  const [backgroundModalIsOpen, setBackgroundModalIsOpen] = useState(false);
  const [textModalIsOpen, setTextModalIsOpen] = useState(false);
  const [changingColours, setchangingColours] = useState(false);
  // const [selectedFont, setSelectedFont] = useState(''); 
  // const [selectedFontWeight, setSelectedFontWeight] = useState(400); 
  const [submitClicked, setSubmitClicked] = useState(false); 
  //const [navBarSettings, setNavbarSettings] = useState(user)
  const [saveClicked, setSaveClicked] = useState(false);

  const openBackgroundModal = () => setBackgroundModalIsOpen(true);
  const closeBackgroundModal = () => setBackgroundModalIsOpen(false);
  const openTextModal = () => setTextModalIsOpen(true);
  const closeTextModal = () => setTextModalIsOpen(false);

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    setColour(event.target.value);
   // setSettings();
  };

  const handleCancelColourChange = () => {
    setColour(originalColour);
    setSelectedColor(originalColour);
    //setSettings();
  }

  // const handleFontChange = () => {
  //   setFontType(newFontFamily, newFontWeight);
  // }

  const handleSaveColor = async () => {
    console.log("From Navbar - backgroundColour: " + selectedColour)
    setColour(selectedColour);
    closeBackgroundModal();
    closeTextModal()
  };

  const save = () => {
    setSaveClicked(true);
    
    closeBackgroundModal();
    closeTextModal()

    saveButton(true);
  }

  const saveButtonReset = () => {
    setSaveClicked(false);
  }
  
  useEffect(() => {
    document.body.style.backgroundColor = selectedColour;

    return () => {
      document.body.style.backgroundColor = 'bisque';
      
    }
  }, [selectedColour, submitClicked])
  // useEffect(() => {
  //   // Fetch images from the database when the component mounts
  //   const fetchBackgroundColour = async () => {
  //     try {
  //       const response = await axios.get(`/upload/profileBackgroundColour/${userId}`);
  //       if (response.status === 200) {
  //         setSelectedColor(response.data.backgroundColour);
  //         document.body.style.backgroundColor = response.data.backgroundColour;
  //       }
  //     } catch (error) {
  //       console.error('Request error:', error);
  //      if (error.response) {
  //        console.error("Response Status:", error.response.status);
  //        console.log("Response Data:", error.response.data);
  //      } else if (error.request) {
  //        console.error("Request Error:", error.request);
  //      } else {
  //        console.error("Error:", error.message);
  //      }
  //     }
  //     finally{
  //       setDoneLoading(true);
  //     }
  //   };    

  //   fetchBackgroundColour();
  // // eslint-disable-next-line react-hooks/exhaustive-deps


  // return () => {
  //   // Reset body background color on component unmount
  //   document.body.style.backgroundColor = 'bisque';
  // };
  // }, [userId, setSelectedColor]); 

   function logout() {
    localStorage.removeItem('userId');
  }


  const ulStyles = {
    listStyle: 'none',
    
    top: 0,
    position: '-webkit-sticky',
    // eslint-disable-next-line no-dupe-keys
    position: 'sticky',
    display: 'inline',
    //display: 'flex', flexDirection:'row', justifyContent: 'center', alignContent: 'center',
    padding: 0,
    margin: 0,

  };

  const liStyles = {
    display: 'inline',
    float: 'left',
    listStyle: 'none',
    curose: 'pointer'
  }
  
  const aStyles = {
    padding: '8px',
    textDecoration: 'none',
    display: 'block',
    backgroundColor: `${selectedColour}`,
    fontWeight: `${user.fontWeight}`,
    fontFamily: `${user.fontFamily}, sans-serif`, // Apply the chosen font
  }

  const handleFontSelect = (fontFamily, fontWeight) => {
    // setNavbarSettings((prevSettings) => {
    //   const updatedSettings = {
    //     ...prevSettings,
    //     fontFamily: fontFamily,
    //     fontWeight: fontWeight
    //   };
    //   return updatedSettings; 
    // });
    setFontType(fontFamily, fontWeight);
  };

  // Callback function to handle submit button click
  const handleFontSubmit = (flag) => {
    setSubmitClicked(flag)
    // Use the selected font data when the submit button is clicked
    // console.log('Selected Font:', navBarSettings.fontFamily);
    // console.log('Selected Font Weight:', navBarSettings.fontWeight);

  };

  return (
    <div style={{ marginTop: '5%' }}>
      <br />
        <div>
          <nav style={{ display: 'flex', height: '100px' }}>
          <button onClick={() => {save()}}>Save</button>
            <ul style={ulStyles}>
              <li style={liStyles}>
                <a style={aStyles} href='/'>
                  Home Page 
                </a>
              </li>
              <li style={liStyles} onClick={logout}>
                <a style={aStyles} href='/login'>
                  Logout
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <button onClick={openBackgroundModal}>Choose a background colour</button>
            {backgroundModalIsOpen && (
              <div>
                <input
                  type='color'
                  value={selectedColour}
                  onChange={handleColorChange}
                  onClick={() => setchangingColours(true)}
                />
                <div ></div>
                {changingColours && (<div> 
                  <button onClick={handleSaveColor} style={{ marginLeft: '10%' }}>
                    Select Colour
                  </button>
                  <button onClick={handleCancelColourChange} style={{ marginLeft: '5px' }}>Cancel</button>
                  </div>
                )}
              </div>
            )}
            {/* <button>Choose a text colour</button>
            {textModalIsOpen && (
              <div>
                <input
                  type='color'
                  onChange={handleColorChange}
                  onClick={() => setchangingColours(true)}
                />
                <div ></div>
                {changingColours && (
                  <button onClick={handleSaveColor} style={{ marginLeft: '10%' }}>
                    Select Colour
                  </button>
                )}
              </div>
            )} */}
          </div>

          {/* Font Selector Integration */}
          <div>
              <FontSelector user={user}
                backgroundColor={selectedColour}
                onSelectFontType={handleFontSelect}
                onSubmit={handleFontSubmit} // Pass the onSubmit callback
                onChange={handleFontSelect}
                save={saveClicked}
                saveReset={saveButtonReset}
              />
      </div>
        </div>

      <br />
    </div>
  );
  
}

export default NavbarProfile
