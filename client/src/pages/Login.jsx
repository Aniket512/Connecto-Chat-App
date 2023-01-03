import React, { useState } from "react";
import './auth.css';
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from "../assets/logo.png"
const Login = () => {

  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)){
        navigate("/");
    }
  },[])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidation();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      console.log(data);
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleValidation = () => {
    const { password,  username } = values;
    if (password === "") {
      toast.error(
        "Username and Password is required.",
        toastOptions
      );
      return false;
    } else if (username === "") {
      toast.error(
        "Username and Password is required.",
        toastOptions
      );
      return false;
    } 

    return true;
  };
  return (
    <>
      <div className="FormContainer">
        <form className="auth-form" action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img className="logo" src={Logo} alt="logo" />
            <h1 className="title">Connecto</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button className="create" type="submit">Log In</button>
          <span className="nav">
            Don't have an account ? <a href="/register">Register</a>
          </span>
        </form>
      </div>
    </>
  )
}

export default Login;