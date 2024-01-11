import React, {useEffect, useState} from 'react'
import axios from 'axios'

function Photos({userId,user}) {

  const [image, setImage] = useState('')
  const [baseImages, setBaseImages] = useState([])
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  }; 

  useEffect(() => {
    // Fetch images from the database when the component mounts
    const fetchImages = async () => {
      try {
        const response = await axios.get(`/images/${userId}`);
        if (response.status === 200 && response.data.images) {
          setBaseImages(response.data.images);
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
      finally{
        setUploadSuccess(true)
      }
    };    

    fetchImages();
  }, [userId]); 

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
       // resolve(reader.result)
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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
        const compressedBase64 = canvas.toDataURL('image/jpeg', 1.0); // Set the desired quality (0.8 is 80%)
        resolve(compressedBase64);
      } }
      reader.onerror = reject
    })
  } 

  const uploadImage = async () => {
    const base64 = await convertBase64(image);
    
    
    try {
      const response = await axios.post('/upload', {
        userId: userId,
        image: base64
      });
      if(response.status === 200)
      {
        setBaseImages((prevImages) => [...prevImages, response.data.image]);
      }
      // if(response.status === 200) {
      //   try {
      //     const data = await axios.get(`/images/${userId}`);
      //     if(data.status === 200) {
      //       setBaseImages(data.data.images);
      //     }
      //   } catch (error) {
      //     console.error('Error getting images:', error);
      //   }
      // }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const uploadProfilePicture = async () => {
    const base64 = await convertBase64(image);
    try {
      const response = await axios.post('/upload/profilePicture', {
        userId: user.id,
        image: base64
      })

      if(response.status === 200)
      {
        setProfilePicture(response.data.profilePicture)
        
      }
    } catch (error) {
      console.error('Error setting an image:', error);
    }

  }

  return (
    <div >
      <input
        type='file'
        onChange={handleImageChange}
      />
      <div style={{display: 'flex', flexDirection: 'column'}}>
      {image && <h1>Selected File: {image.name}</h1>}
      <button disabled={!image} onClick={uploadImage} style={{width: '10%'}}>Submit</button>
      </div>
      {
  baseImages && baseImages.map((baseImage, index) => (
  <img key={index} src={baseImage} height={'200px'} width={'300px'} style={{margin: 0, padding: '5px'}}   alt={`Img ${index}`} />
  ))
}
<div>
      {/* <input
        type='file'
        onChange={handleImageChange}
      /> */}
      {/* <div style={{display: 'flex', flexDirection: 'column'}}>
      {image && <h1>Selected File: {image.name}</h1>}
      <button disabled={!image} onClick={uploadProfilePicture} style={{width: '10%'}}>Submit</button>
      </div> */}
      {profilePicture && <img  src={profilePicture} height={'200px'} width={'300px'} style={{padding: 0, margin: 0}} alt={`Profile Pic`} />}
    </div>
  </div>
  )
}

export default Photos
