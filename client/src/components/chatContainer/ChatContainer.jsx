import React, { useRef } from "react";
import ChatInput from "../chatInput/ChatInput";
import { recieveMessageRoute, sendMessageRoute } from "../../utils/APIRoutes";
import Logout from "../logout/Logout";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./chatContainer.css";

const ChatContainer = ({ currentChat, currentUser, socket }) => {

    const divRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    useEffect(() => {
        async function getMessages() {
            if (currentChat) {
                const response = await axios.post(recieveMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                })
                setMessages(response.data);
            }
        }
        getMessages();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        });
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        })
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    }
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            })

        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage])

    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return <>
        <div className="chat-container">
            <div className="chat-header">
                <div className="user-details">
                    <div className="user-avatar-img">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt=""
                        />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => {
                    return (
                        <div key={uuidv4()}>
                            <div
                                className={`message ${message.fromSelf ? "sended" : "received"
                                    }`}
                            >
                                <div className="content ">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={divRef} />

            </div>
            <ChatInput handleSendMsg={handleSendMsg} />

        </div>
    </>
}

export default ChatContainer;