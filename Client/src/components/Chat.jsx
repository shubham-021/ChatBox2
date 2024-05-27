import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UserContextProvider";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:5000')

const Chat = () => {
    const navigate = useNavigate()
    const [userchat , setUserChat] = useState("")
    const [messages , setMessages] = useState([])
    const [creator , setCreator] = useState(false)

    const { user } = useAuth();

    
    useEffect(()=>{

        if(user.joinedRoomCode){
           const roomCode = user.joinedRoomCode
           socket.emit('joinRoom', roomCode)
        }

        if(user.roomCode){
            setCreator(true)
            const roomCode = user.roomCode
            socket.emit('createRoom' , roomCode)
        }

        const handleMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', (message)=>{
                setMessages((prevMessages) => [...prevMessages , message])
            })
        }
    },[user, setCreator, setMessages, socket])

    

    const handleUserChat = (e) => {
        setUserChat(e.target.value)
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        const roomCode = user.roomCode || user.joinedRoomCode
        socket.emit('chatMessage' , {roomCode:roomCode , message:userchat})
        setUserChat("")
    }

    const handleLeave = (e) => {
        e.preventDefault()
        socket.emit('leaveRoom')
        creator ? user.roomCode  = "" : user.joinedRoomCode = ""
        navigate("/message")
    }

    return(
        <div className="h-screen w-screen bg-[#023047] overflow-hidden">
            <div className="w-screen h-[60px] bg-[#fb8500] flex items-center justify-around">
                <div className="font-poppins text-xl text-white">Room Code : {creator ? user.roomCode : user.joinedRoomCode}</div>

                <div className="font-poppins text-xl text-white">UserName : {user.userName}</div>
            </div>
            <div className="userChats w-screen h-[85%] bg-slate-800 font-poppins text-white" id="messages">
                {messages.map((msg , index) => (
                    <p className="bg-slate-500 my-2" key={index}>{msg}</p>
                ))}
            </div>
            <div className="w-[87%] h-[8%] ml-5 relative">
                <input type="text" placeholder="Type your message..." value={userchat} onChange={handleUserChat} className="text-white bg-transparent w-full h-full focus:outline-none" />
            </div>
            <div onClick={handleSendMessage} className='bg-[#fb8500] hover:cursor-pointer font-poppins text-white rounded-lg absolute bottom-0 right-0 h-[7.5%] w-[11%] flex justify-center items-center'>
                Send Message
            </div>

            <div onClick={handleLeave} className='bg-[#023047] hover:cursor-pointer font-poppins text-white rounded-l-lg absolute top-0 right-0 h-[6.5%] w-[11%] flex justify-center items-center'>
                Leave
            </div>
            
        </div>
    )
}

export default Chat