import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn'
import HomeScreen from './HomeScreen';

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const localStorageData = localStorage.getItem('userId');
    
  //   if (!localStorageData) {
  //     // Redirect to the login screen if localStorage data is not available
  //     navigate('/login');
  //     return;
  //   }

  //   async function fetchData() {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/${localStorageData}`);
  //       setData(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error:', error);
  //       setLoading(false);
  //       // Redirect to the login screen when there is an error
        
  //     }
  //   }

  //   fetchData(); // Call the async function

  // }, [navigate]);
  useEffect( () => {
    const isUserLoggedIn = window.localStorage.getItem('userId');
    //if(isUserLoggedIn) navigate()
    if (isUserLoggedIn) {
      const user = JSON.parse(isUserLoggedIn);
        navigate(`/user?=${user.id}`);
    }
  }, [navigate])

  return (
    <div>
      {/* {loading ? (
        <p>Loading...</p>
      ) : data ? ( */}
        <div>
          <HomeScreen />
        </div>
      {/* ) : (
        <SignIn />
      )} */}
    </div>
  );
};

export default HomePage;


  // useEffect( () => {
  //   // Code to scan localStorage
  //   const localStorageData = localStorage.getItem('userId');
  //   if (localStorageData) {
  //     try {
  //       const response = await axios.post("http://localhost:5000/login",{
  //       email: email,
  //       password: password
  //       })
  //       if (response.status === 200) {
  //         const data = response.data; // Access response data
  //         console.log(data); // You can use this data in your app as needed.
  //        // window.localStorage.setItem()
  //         navigate(`/user/${response.data.userId}`);
  //       } 
  //     } catch (error) {
  //       console.log("error: " + error);
  //     }
  //     // Handle the data from localStorage as needed
  //     console.log('Data from localStorage:', localStorageData);
  //   }

  //   // Code to scan sessionStorage
  //   const sessionStorageData = sessionStorage.getItem('userId');
  //   if (sessionStorageData) {
  //     // Handle the data from sessionStorage as needed
  //     console.log('Data from sessionStorage:', sessionStorageData);
  //   }
  // }, []); // Empty dependency array to run the effect only once on component mount

 

// return (
//   <div className='' style={{margin: '15px'}}>
//     <div className='' style={{ margin: '15px' }}>
//       <Button fullWidth component="a" href="/login" variant="contained" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
//           Login
//       </Button>
//       <Button fullWidth omponent="a" href="/register" variant="contained" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
//           Register
//       </Button>
//       <Button fullWidth component="a" href="/forgot-password" variant="contained" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
//           Forgot Password
//       </Button>
//     </div>
//   </div>
//   );

