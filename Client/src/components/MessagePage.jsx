import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/UserContextProvider.jsx'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

function MessagePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [join , setJoin] = useState(false)
  const [joinedRoomCode , setJoinedRoomCode] = useState(null)
  
  const handleCreateRoom = (e) => {
    e.preventDefault()

    const min = 100000;
    const max = 999999;
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    
    user.roomCode = randomCode
    navigate('/chat')
  
  }
  const handleJoinRoomforDialogueBox = (e) => {
    e.preventDefault()
    setJoin(true)
  }

  const handleRoomCode = (e) => {
    setJoinedRoomCode(e.target.value)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    user.joinedRoomCode = joinedRoomCode
    navigate('/chat')
  }

  return (
  <>
    <div className='h-screen w-screen bg-[#023047] flex justify-center items-center '>{
      !join ? (      
      <div>
        <button onClick={handleJoinRoomforDialogueBox} className='h-[40px] w-[100px] bg-[#fb8500] font-poppins text-white rounded-lg hover:scale-150 mx-11 ease-in-out transition-all'>Join Room</button>
        <button onClick={handleCreateRoom} className='h-[40px] w-[120px] bg-[#fb8500] font-poppins text-white rounded-lg hover:scale-150 mx-11 ease-in-out transition-all'>Create Room</button>
      </div>) : (
        <div>
          <input type="text" onChange={handleRoomCode} value={joinedRoomCode} placeholder='Enter Room code' id="" className='w-full border-b-2 focus:outline-none focus:border-[#fb8500] border-gray-100 p-4  mt-1 bg-transparent text-white' />
          <button className='h-[40px] w-[120px] bg-[#fb8500] font-poppins text-white rounded-lg mx-4 my-2' onClick={handleJoinRoom}>Join Room</button>
        </div>
      )
    }

    </div>
  </>  
  )
}

export default MessagePage