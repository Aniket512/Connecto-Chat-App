import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/chatContainer/ChatContainer";
import Contacts from "../components/contacts/Contacts";
import Welcome from "../components/welcome/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import "./chat.css";


const Chat = () => {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);

    useEffect(() => {
        async function fetchUser() {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
            }
        }
        fetchUser();

    }, []);
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchContacts() {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate("/setAvatar");
                }
            }

        }
        fetchContacts();
    }, [currentUser])

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    
    return <div className="Chat">
        <div className="container">
            <Contacts contacts={contacts} changeChat={handleChatChange} currentUser={currentUser} />
            {
                currentChat === undefined ?
                    ((currentUser) ? <Welcome /> : <></>) :
                    (
                        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                    )}
        </div>
    </div>
}

export default Chat;