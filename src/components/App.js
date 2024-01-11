import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import SignIn from './SignIn'
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordAuth from './ForgotPasswordAuth';
import ResetPassword from './ResetPassword';
import HomeFeed from './HomeFeed/HomeFeed';
import Profile from './ProfilePage/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/forgot-password-authentication' element={<ForgotPasswordAuth />}/>
        <Route path='/forgot-password/:userId' element={<ForgotPasswordAuth />}/>
        <Route path='/forgot-password/reset/:userId' element={<ResetPassword />}/>
        <Route path='/user' element={<HomeFeed />}
          query={{
          userId: ':userId',
        }}
        />
        <Route path="/profile/:profile_Id" element={<Profile />} 
        />
      </Routes>
      
    </Router>
  );
}

export default App;