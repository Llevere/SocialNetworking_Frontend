// import React, { useState } from 'react';
// import { TextField, Button } from '@mui/material';

// const DigitInput = ({ onDigitChange, index }) => {
//   const handleChange = (event) => {
//     const digit = event.target.value;
//     if (/^[0-9]$/.test(digit) || digit === '') {
//       onDigitChange(index, digit);
//     }
//   };

//   return (
//     <TextField
//       label={`Digit ${index + 1}`}
//       onChange={handleChange}
//       inputProps={{ maxLength: 1 }}
//     />
//   );
// };


// const ForgotPasswordAuth = () => {
//   const [digits, setDigits] = useState(['', '', '', '', '', '']);

//   const isFormComplete = digits.every((digit) => digit !== '');

//   const handleSubmit = () => {
//     // You can perform your submit action here using Axios or any other method.
//     // For demonstration purposes, we'll just log the digits.
//     console.log('Submitted digits:', digits);
//   };

//   const handleDigitChange = (index, digit) => {
//     const updatedDigits = [...digits];
//     updatedDigits[index] = digit;
//     setDigits(updatedDigits);
//   };

//   return (
//     <div>
//       <form >
//         {digits.map((digit, index) => (
//           <DigitInput
//             key={index}
//             index={index}
//             onDigitChange={handleDigitChange}
//           />
//         ))}
//         <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         disabled={!isFormComplete}
        
//       >
//         Submit
//       </Button>
//       </form>
      
//     </div>
//   );
// };

// export default ForgotPasswordAuth;


import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button, Paper, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';
import './ForgotPassword.css'


const ForgotPasswordAuth = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isButtonDisabled, setButtonDisabled] = useState(true);


  const handleChange = (index, value) => {
    if (value.match(/^\d*$/) && value.length <= 1) {
      const updatedDigits = [...digits];
      updatedDigits[index] = value;
      setDigits(updatedDigits);
      setButtonDisabled(updatedDigits.includes('') || updatedDigits.length !== 6);

    }
  };

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // If the request was successful, return the response
      return response;
    },
    function (error) {
      // Prevent Axios from logging errors to the console
      return Promise.resolve(error);
    }
  );

  const [customAlertMessage, setCustomAlertMessage] = useState(null);

  const showAlert = () => {
    setCustomAlertMessage('Hello, World!');
  };


  async function handleSubmit(event) {
    event.preventDefault();

    const userId = sessionStorage.getItem('userId');

    try {
     
      const response = await axios.post(`http://localhost:5000/forgot-password/${userId}`, {
        id: userId,
        authCode: digits, // Convert the array of digits to a string
      });
      if (response.status === 200) {
        if(sessionStorage.getItem('resetCode'))
        {
          sessionStorage.removeItem('resetCode');
        }
        navigate(`/forgot-password/reset/${userId}`);
      }
      else {
        console.clear();

        if (!response.response.data.canAttemptMore) {
          if(response.response.data.resetCodeExpired)
          {
            alert(response.response.data.message)
          } else {
            console.log(response.response.data)
            alert("Incorrect entry. You've run out of attempts. Please start again.");
          }
        } else {
          alert("Incorrect entry. Please try again.");
        }
      }
    } catch (error) {
      console.clear();
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

  return (
    <div>
    <div style={{position: 'absolute'}}>
        <Button variant='contained' onClick={() => navigate('/login')}>Home</Button>
        <Button variant='contained' onClick={() => navigate('/forgot-password')}>Forgot Password</Button>
    </div>
      <div id='forgotPassword-resetCode-mainDiv'>
      
        <Paper id='forgotPassword-resetCode-paper'>
          <form onSubmit={handleSubmit} id='forgotPassword-resetCode-form'>
            <Grid container spacing={1} id='forgotPassword-resetCode-outerGrid'>
              {digits.map((digit, index) => (
                <Grid item xs={1} key={index} id='forgotPassword-resetCode-innerGrid'>
                  <TextField
                  
                    variant="outlined"
                    fullWidth
                    label={`Digit ${index + 1}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    inputProps={{
                      maxLength: 1,
                    }}
                  />
                </Grid>

              ))}
            </Grid>
            <Button id='forgotPassword-resetCode-submit'
            type="submit" variant="contained" color="primary" disabled={isButtonDisabled}>
              Submit
            </Button>

            
          </form>
          
        </Paper>
        
      </div>
      
      </div>
    // <div id='forgotPassword-resetCode-mainDiv'>
    // <Paper id='forgotPassword-resetCode-paper'>
    //   <form onSubmit={handleSubmit}
    //   id='forgotPassword-resetCode-form'
    //   >
    //   <Grid container spacing={1}
    //   id='forgotPassword-resetCode-outerGrid'>
    //     {digits.map((digit, index) => (
    //       <Grid item xs={1} key={index}
    //       id='forgotPassword-resetCode-innerGrid'>
    //         <TextField
    //           variant="outlined"
    //           fullWidth
    //           id={`digit${index + 1}`}
    //           label={`Digit ${index + 1}`}
    //           type="text"
    //           value={digit}
    //           onChange={(e) => handleChange(index, e.target.value)}
    //           inputProps={{
    //             maxLength: 1,
    //           }}
    //         />
    //       </Grid>
    //     ))}
    //   </Grid>
    //   <Button type="submit" variant="contained" color="primary" disabled={isButtonDisabled}>
    //     Submit
    //   </Button>
    // </form>
    // </Paper>
    // </div>
  );
};

export default ForgotPasswordAuth;
