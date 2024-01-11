import React, { useState} from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

  const navigate = useNavigate();
    const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (submitted) {
      // Validate email only when the form is submitted
      if (validateEmail(newEmail)) {
        setEmailError('');
      } else {
        setEmailError('Invalid email address format');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Mark the form as submitted
    setSubmitted(true);

    // Validate the email again when the form is submitted
    if (validateEmail(email)) {
      try {
        const response = await axios.post("/forgot-password",{
        email: email
        })
        if (response.status === 200) {
          window.sessionStorage.setItem('userId', response.data.userId);
          window.sessionStorage.setItem('resetCode', response.data.resetCode)
          navigate(`/forgot-password/${response.data.userId}`);
          
        } 
      } catch (error) {
        if (error.response) {
          console.error("Response Status:", error.response.status);
          console.log("Response Data:", error.response.data);
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    } else {
      setEmailError('Invalid email address format');
    }
  };

  return (
    // component='a' href='/forgot-password-test'
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        
        <Box
          sx={{
            marginTop: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        
          <Box component="form" onSubmit={handleSubmit}>
          <h1 style={{maxHeight: '50vh', maxWidth: '75vw'}}>Forgot Password</h1>
            <Grid container spacing={2}>
               <Grid item xs={12}>
         <TextField
           required
           fullWidth
           id="email"
           label="Email Address"
           name="email"
           autoComplete="email"
           value={email}
           onChange={handleEmailChange}
          error={!!emailError && submitted}
          helperText={emailError}
         />
       </Grid>
            </Grid>
            <Button color="primary"
                 onClick={handleSubmit}
                  fullWidth variant="contained" style={{marginTop: '20px'}}>Forgot Password</Button>
          </Box>
        </Box>
      </Container>
  )
}

export default ForgotPassword;