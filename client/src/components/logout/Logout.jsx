import axios from "axios";
import React from "react";
import { BiPowerOff } from "react-icons/bi"
import { useNavigate } from "react-router-dom";
import { logoutRoute } from "../../utils/APIRoutes";
import "./logout.css";

const Logout = () => {

    const navigate = useNavigate();

    const handleClick = async () => {
        const id = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
        const data = await axios.get(`${logoutRoute}/${id}`);
        if (data.status === 200) {
            localStorage.clear();
            navigate("/login");
        }
    };

    return <div onClick={handleClick} className="logout">
        <BiPowerOff />
    </div>
}

export default Logout;