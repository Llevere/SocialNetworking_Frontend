import React, { useRef, useState, useEffect } from "react";
import { Button, Paper, Modal, Grid } from "@mui/material";
import "./ProfileCSS.css";
import axios from "axios";
function Images({ userImages, userId, isUserProfile, updateImages }) {
  const [showImageUploaded, setImageConfirmation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState("");
  const hiddenFileInput = useRef(null);

  useEffect(() => {}, []);

  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const lightGreen = "#9dc183";
  // const postNameFontSize = "24px";
  //const commentNameFontSize = "22px";
  // const replyNameFontSize = "20px";
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // resolve(reader.result)
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

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
          const compressedBase64 = canvas.toDataURL("image/jpeg", 1.0); // Set the desired quality (0.8 is 80%)
          resolve(compressedBase64);
        };
      };
      reader.onerror = reject;
    });
  };

  const handleUploadChange = async (event) => {
    const fileUploaded = event.target.files[0];
    console.log("handleUploadChange called.");
    const image = await convertBase64(fileUploaded);
    setImage(image);
    setImageConfirmation(true);
    // const originalColor = lightGreen;

    // const darkenColor = (color, factor) => {
    //   // Convert hex to RGB
    //   const r = parseInt(color.slice(1, 3), 16);
    //   const g = parseInt(color.slice(3, 5), 16);
    //   const b = parseInt(color.slice(5, 7), 16);

    //   // Darken the color by reducing each RGB component
    //   const darkenedR = Math.round(r * factor);
    //   const darkenedG = Math.round(g * factor);
    //   const darkenedB = Math.round(b * factor);

    //   // Convert back to hex
    //   const darkenedColor = `#${darkenedR.toString(16)}${darkenedG.toString(
    //     16
    //   )}${darkenedB.toString(16)}`;

    //   return darkenedColor;
    // };

    // const slightlyDarkerColor =  darkenColor(originalColor, 0.8); // Adjust the factor as needed

    // console.log(slightlyDarkerColor);
  };

  const handleImageDisplay = () => {
    setImageConfirmation(false);
  };

  const handleImageUpload = async () => {
    try {
      const response = await axios.post("/profile/upload/image", {
        userId: userId,
        image: image,
      });

      if (response.status === 200) {
        console.log("Image uploaded.");
        updateImages(response.data.imageObject);
      }
    } catch (error) {
      console.log("Error when uploading an image: " + error);
    }
  };

  // const handleImageClick = (image) => {
  //   setSelectedImage(image);
  // };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const handleDeletePhoto = () => {
    // Handle delete photo logic here
    console.log("Delete photo:", selectedImage);
    setSelectedImage(null); // Clear the selected image after action
  };

  const handleViewPhoto = () => {
    // Handle view photo logic here
    console.log("View photo:", selectedImage);
  };

  return (
    <div id="Images-OuterDiv">
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "10%" }}
      >
        <h1>Images</h1>
        {isUserProfile && (
          <div>
            <button id="button-upload" onClick={handleUploadClick}>
              Upload a file
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={hiddenFileInput}
              onChange={handleUploadChange}
            />
            <Modal
              open={showImageUploaded}
              onClose={() => {
                handleImageDisplay();
              }}
              sx={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                top: "5%",
                height: "50%",
              }}
            >
              <Paper
                sx={{
                  width: "35%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={image}
                  alt="Img being uploaded"
                  style={{
                    height: "70%",
                    width: "100%",
                    objectFit: "contain", // Keep the image within its container
                    paddingTop: "5%",
                  }}
                />
                <div
                  style={{
                    marginBottom: "5%",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      handleImageUpload();
                      handleImageDisplay();
                    }}
                    variant="contained"
                    sx={{
                      margin: "2% 2% 1% 0",
                      backgroundColor: lightGreen,
                      "&:hover": {
                        backgroundColor: "#7e9a69", // Change the color on hover
                      },
                    }}
                  >
                    Upload
                  </Button>
                  <Button
                    onClick={() => {
                      handleImageDisplay();
                    }}
                    variant="contained"
                    sx={{
                      margin: "2% 0 1% 2%",
                      backgroundColor: "#C70000",
                      "&:hover": {
                        backgroundColor: "#9f0000", // Change the color on hover
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Paper>
            </Modal>
          </div>
        )}
      </div>
      {userImages && userImages.length > 0 ? (
        <Paper id="Images-Paper">
          <Grid container spacing={2} id="Images-OuterGrid">
            {userImages &&
              userImages.map((image, index) => (
                <Grid item xs={12} sm={8} md={4} key={index} id="Images-Grid">
                  <img
                    id="Images-Img"
                    src={image.fileName}
                    alt={`Img ${index}`}
                    onClick={() => handleImageClick(image)}
                  />
                  {selectedImage && selectedImage._id === image._id && (
                    <Paper id="Option-Pane">
                      {isUserProfile && (
                        <Button onClick={handleDeletePhoto}>
                          Delete Photo
                        </Button>
                      )}
                      <Button onClick={handleViewPhoto}>View Photo</Button>
                      <Button onClick={() => setSelectedImage(null)}>
                        Cancel
                      </Button>
                    </Paper>
                  )}
                </Grid>
              ))}
          </Grid>
        </Paper>
      ) : (
        <Paper id="Images-Paper">No images</Paper>
      )}
    </div>
  );
}

export default Images;
