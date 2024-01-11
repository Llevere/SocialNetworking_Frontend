import * as React from 'react';
import axios from 'axios';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import '../index.css'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Matt Levere
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function ResetPassword() {

  const navigate = useNavigate();

  // State variables for password criteria
  const [above8Chars, setAbove8Chars] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [hasUpperCase, setUpperCase] = useState(false);


  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };



  const [isButtonDisabled, setButtonDisabled] = useState(true);

  // useEffect(() => {
  //   setAutoFocusFirstName(true);
  //   setAutoFocusPassword(false);
  // }, []);



  const passwordValidator = () => {

   

    //const { password, confirmPassword } = event.target;
    //setPasswordData({ ...passwordData, [password]: confirmPassword });
    const confirmPasswordInput = document.getElementById('confirmPassword').value;
    const passwordInput = document.getElementById('password').value;

    // Checks to see if the passwords meet requirements
    // All forms need to be filled in for the button to be functional
     if(passwordInput.length <= 8 && confirmPasswordInput.length <= 8) setButtonDisabled(true);
     else if(!hasSpecialCaseCharacters(passwordInput)) setButtonDisabled(true);
     else if(!hasUppercaseCharacters(passwordInput)) setButtonDisabled(true);
     else if(passwordInput !== confirmPasswordInput) setButtonDisabled(true);
     
     else setButtonDisabled(false);

    setAbove8Chars(passwordInput.length >= 8);
    setHasSpecialChar(hasSpecialCaseCharacters(passwordInput));
    setHasNumber(/\d/.test(passwordInput));
    setPasswordMatch(passwordInput === confirmPasswordInput && passwordInput.length > 7);
    setUpperCase(hasUppercaseCharacters(passwordInput))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      
      const userId = window.sessionStorage.getItem('userId');
      const password = data.get('password');
  
      const response = await axios.post(`http://localhost:5000/forgot-password/reset`,{
      userId: userId,
      password: password
      
    })
      if (response.status === 200) {
        const data = response.data; // Access response data
        console.log(data); // You can use this data in your app as needed.

        if(data.passwordMatch)
        {
          console.log("Choose a different password, this has been used previously.")
          alert("Choose a different password, this has been used previously.");
        }
        else
        {
          alert("Password has changed.")
        }
        // else
        // navigate("/");
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

  };

  function hasUppercaseCharacters (password) {
    const uppercaseRegex = /[A-Z]/;
    const passwordHasUppercase = uppercaseRegex.test(password);

    return passwordHasUppercase;
  }

  function hasSpecialCaseCharacters(password) {
    const specialCharacterRegex = /[^A-Za-z0-9]/;
    const passwordHasSpecialCharacter = specialCharacterRegex.test(password);


    return passwordHasSpecialCharacter;
  }

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}
          onChange={passwordValidator}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  onChange={passwordValidator}
                  InputProps={{
                  endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={passwordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={passwordValidator}
                  InputProps={{
                  endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox checked={above8Chars} />}
          style={{pointerEvents: 'none'}}
          label="8 Characters Or Above"
        />
        <FormControlLabel
          control={<Checkbox checked={hasSpecialChar} />}
          style={{pointerEvents: 'none'}}
          label="Special Character"
        />
        <FormControlLabel
          control={<Checkbox checked={hasUpperCase} />}
          style={{pointerEvents: 'none'}}
          label="Uppercase"
        />
        <FormControlLabel
          control={<Checkbox checked={hasNumber} />}
          style={{pointerEvents: 'none'}}
          label="Number"
        />
        <FormControlLabel
          control={<Checkbox checked={passwordMatch} />}
          style={{pointerEvents: 'none'}}
          label="Passwords match"
        />
      </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isButtonDisabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}