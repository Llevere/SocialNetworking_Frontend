import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const RegisterSuccess = () => {

  const navigate = useNavigate();

  const sendRequest = async (event) => {
    event.preventDefault();
    try {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const confirmPassword = event.target.confirmPassword.value;
  
      const response = await axios.post("http://localhost:5000/register",{
      email: email,
      password: password,
      confirmPassword: confirmPassword
    })
      if (response.status === 200) {
        const data = response.data; // Access response data
        console.log(data); // You can use this data in your app as needed.
        navigate("/login");
      } else {
        console.error('Request failed');
      }
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  return (
    <div className="request-container">
    <h2>Register</h2>
    <form className="request-form" onSubmit={sendRequest} style={{margin: 5}}>
      <label htmlFor="email">Email: </label>
      <input type="text" className="emailText" id="email" name="email" required placeholder='Email' />
      <label htmlFor="password"> Password: </label>
      <input type="password" className="pass" id="password" name="password" required placeholder='Password' />
      <label htmlFor='password'> Confirm Password: </label>
      <input type="password" className="confirm-pass" id="confirm-password" name="confirmPassword" required placeholder='Confirm Password' />
      <button type="submit" className='btn btn-dark'>Submit</button>
    </form>
    </div>
  );
};

export default RegisterSuccess;
