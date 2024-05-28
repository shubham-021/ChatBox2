import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContextProvider.jsx'

const Chat = () => {
    const navigate = useNavigate()
    const [userchat , setUserChat] = useState("")
    const [messages , setMessages] = useState([])

    const { user } = useAuth();
    const { socket } = useSocket();

    useEffect(() => {
        const roomCode = user.roomCode
        if(user.joined){
            socket.emit('joinRoom', roomCode)
        }else{
            socket.emit('createRoom', roomCode)
        }
    },[user.roomCode])

    useEffect(() => {
        socket.on("message", (message) => {
            console.log('Received message:', message);
            setMessages((prev) => [...prev, message])
        })
        
        return () => {
            socket.off("message")
        }
    } , [])
    

    const handleUserChat = (e) => {
        setUserChat(e.target.value)
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        const roomCode = user.roomCode
        socket.emit('chatMessage' , {roomCode:roomCode , message:userchat})
        setUserChat("")
    }

    const handleLeave = (e) => {
        e.preventDefault()
        socket.emit('leaveRoom')
        user.roomCode = ""
        navigate("/message")
    }

    return(
        <div className="h-screen w-screen bg-[#023047] overflow-hidden">
            <div className="w-screen h-[60px] bg-[#fb8500] flex items-center justify-around">
                <div className="font-poppins text-xl text-white">Room Code : {user.roomCode}</div>

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