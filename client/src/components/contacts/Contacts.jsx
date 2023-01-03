import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/logo.png"
import io from "socket.io-client";
import { host } from "../../utils/APIRoutes";
import { FaCircle, FaPencilAlt } from "react-icons/fa";
import "./contacts.css";

let onlineUsers = [];
const Contacts = ({ contacts, currentUser, changeChat }) => {
    const socket = useRef();
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
            socket.current.on("get-users", (users) => {
                onlineUsers = users;
            });
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    const checkOnlineStatus = (chat) => {
        const online = onlineUsers.find((user) => user.userId === chat._id);
        return online ? true : false;
    };
    return <>{
        currentUserImage && currentUserName && (
            <div className="contact-container">
                <div className="brand">
                    <img className="logo" src={Logo} alt="" />
                    <h3>CONNECTO</h3>
                </div>
                <div className="contacts">
                    {
                        contacts.map((contact, index) => {
                            return (
                                <div className={`contact ${index === currentSelected ? "selected" : ""}`} key={index} onClick={() => changeCurrentChat(index, contact)}>
                                    <div className="avatar">
                                        <img
                                            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                        {checkOnlineStatus(contact) ? <p className="status" ><FaCircle /> Online</p> : ""}
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
                <div className="current-user">
                    <div className="user-avatar"><a href="/setAvatar">
                        <img
                            className="user-icon"
                            src={`data:image/svg+xml;base64,${currentUserImage}`}
                            alt="avatar"
                        />
                        <div className="edit"><FaPencilAlt /></div>
                    </a></div>
                    <div className="username">
                        <h2>{currentUserName}</h2>
                    </div>
                </div>
            </div>
        )
    }
    </>
}

export default Contacts;