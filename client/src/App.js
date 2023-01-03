import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/setAvatar/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    <ToastContainer/>
    </BrowserRouter>
    
  );
}

export default App;
