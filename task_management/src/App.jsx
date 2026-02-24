import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import { AuthGuard, AdminGuard, GuestGuard } from "./Components/Guard.jsx"
import AdminPage from './Pages/AdminPage.jsx';
import AuthProvider, { useAuth } from './hooks/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <nav>{!user ?
      (<></>)
      : (<>
        <NavLink to={`/dashboard/${user.id}`}>My Dashboard</NavLink>{"  |  "}
        {user.role === 'admin' && <><NavLink to="/admin">Admin Page</NavLink>{"  |  "}</>}
        <button onClick={() => {
          alert("Logging out...");
          logout();
          navigate("/login");
        }} >Logout</button>
      </>)}
    </nav>)
};

function App() {

  return (<>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<GuestGuard />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>


          <Route element={<AuthGuard />}>
            <Route path="/dashboard/:userId" element={<HomePage />} />
          </Route>

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>


          <Route path="*" element={<>404 PAGE NOT FOUND</>} />
        </Routes>
      </BrowserRouter >
    </AuthProvider >
  </>
  )
}

export default App
