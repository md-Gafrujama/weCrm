import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login.jsx';
import Sign from './component/sign.jsx';
import Dashboard from './component/dashboard.jsx';
import UserProfile from './component/userProfile.jsx';
import Register from './component/register.jsx';
import './App.css';
import ProtectedRoute from './component/protectedRoute.js';
import ForgetPassword from './component/forgetPassword.jsx';
import OTPPage from './component/Otp.jsx';
import  UpdatePassword from "./component/UpdatePassword.jsx"
import AllUsers from './component/AllUsers.jsx';
import EditUser from './component/EditUser.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddLeadsForm from './component/AddLeadsForm.jsx';
import LeadsActivity from './component/LeadsActivity.jsx';
import AlertsandReminderForm from './component/AlertsandReminderForm.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("token"); 
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <Router>
        <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={ isLoggedIn ? (
              userType === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/userProfile" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {!isLoggedIn && ( 
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetPassword" element={ <ForgetPassword/>} />

            {/* OTP Component tabhi navigate hoga , when otp  is sent */}

            <Route path="/otp" element={  localStorage.getItem("emailSent") === "true" ? <OTPPage />: <Navigate to="/forgetPassword" replace /> } />
            <Route path="/updatePass" element= {<UpdatePassword/>} />
          </>
        )}

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/sign" element={userType === "admin" ? <Sign /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={userType === "admin" ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/userProfile" element={<UserProfile onLogout={handleLogout} />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/edit-user/:userId" element={<EditUser />} />
          <Route path="/add-leads-as-admin" element={<AddLeadsForm />} />
          <Route path="/alerts-and-reminder-admin" element={<AlertsandReminderForm />} />
          <Route path="/leadsactivity" element={<LeadsActivity />} />
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
