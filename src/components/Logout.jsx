import React from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {

    const navigate = useNavigate();

    const logout = () => {
        if(localStorage.getItem("userId")){
            localStorage.removeItem("userId");
            navigate("/login")
        }
    }

  return (
    <button onClick={logout}>Logout</button>
  )
}

export default Logout