import React from "react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs"
import Picker  from "emoji-picker-react";
import { useState } from "react";
import "./chatInput.css";

const ChatInput = ({handleSendMsg}) => {

    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (event) => {
        let message = msg;
        message += event.emoji;
        setMsg(message);
    }

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    
    const sendChat = (event) => {
        event.preventDefault();
        if(msg.length > 0){
            handleSendMsg(msg);
            setMsg("");
        }
        setShowEmojiPicker(false);
    }
    return <>
        <div className="chat-input-container">
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                    {showEmojiPicker && <Picker width={350} height={400} onEmojiClick={handleEmojiClick} />}
                </div>
            </div>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <input
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit">
                    <IoMdSend />
                </button>
            </form>
        </div>
    </>
}
export default ChatInput;