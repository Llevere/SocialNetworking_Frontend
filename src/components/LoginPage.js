import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import '../index.css';
import 'bootstrap/dist/css/bootstrap.css'

const LoginPage = () => {

  const navigate = useNavigate();

  const sendLogin = async (event) => {
    event.preventDefault();
    // Handle form submission logic

    const email = event.target.email.value;
    const password = event.target.password.value;

    console.log(event.target);

    try {
      const response = await axios.post("http://localhost:5000/login",{
      email: email,
      password: password
      })
      if (response.status === 200) {
        const data = response.data; // Access response data
        console.log(data); // You can use this data in your app as needed.
    
        navigate("/");
      } 
    } catch (error) {
      
    }

  };

  // useEffect(() => {
  //   // Use navigate when a condition is met, e.g., after form submission
      
    
  // }, [navigate]);

  return (
//   <div className="login-container d-flex justify-content-center align-items-center" style={{margin: "5%", height: '50vh'}}>
//   <h2 className='d-flex'>Login</h2>
//   <form className="login-form" onSubmit={sendLogin}>
//     <div style={{ display: 'flex', flexDirection: 'row' }}>
//       <div className="form-group">
//         <label htmlFor="email" id="emailLabel">Email:</label>
//         <input type="text" className="form-control" id="email" name="email" required placeholder="Email" />
//       </div>
//       <div className="form-group">
//         <label htmlFor="password" className="passwordText" id="passwordLabel">Password:</label>
//         <input type="password" className="form-control" id="password" name="password" required placeholder="Password" />
//       </div>
//     </div>
//     <div style={{direction: 'flex', flexDirection: 'column'}}>
//         <button type="submit" className="btn btn-dark">Login</button>
//       </div>
//   </form>
// </div>
<div className="login-container d-flex justify-content-center align-items-center" style={{height: "75vh", maxWidth: '100vw'}}>
  <form className="login-form" onSubmit={sendLogin}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="form-group">
        <label htmlFor="email" id="emailLabel">Email:</label>
        <input type="text" className="form-control" id="email" name="email" required placeholder="Email" />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="passwordText" id="passwordLabel">Password:</label>
        <input type="password" className="form-control" id="password" name="password" required placeholder="Password" />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button type="submit" className="btn btn-dark">Login</button>
    </div>
  </form>
</div>

  );
};

export default LoginPage;