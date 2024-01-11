import React from 'react'
import { useNavigate } from 'react-router-dom';



const centerComponent = {
    display: 'flex',
    margin: 0,
    padding: 0,
    height: '100px',
    width: '100px',
    justifyContent: 'center',
    alignItems: 'center'
}


function HomeScreen() {

    const navigate = useNavigate();

    function logout() {
        sessionStorage.removeItem('userId');
        localStorage.removeItem('userId');
    }
    
    function signIn() {
        
    }

  return (
    
    <div style={centerComponent}>
        <button onClick={logout}>Logout</button>
    <a href='/login'>
        <button onClick={signIn}>Sign In</button>
    </a>
    
  </div>
  )
}

export default HomeScreen