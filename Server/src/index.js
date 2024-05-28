import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { Server } from 'socket.io'
import { createServer } from 'http'

dotenv.config({
    path: "./.env"
})

const server = createServer(app)
const io = new Server(server , {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
        }
})

const roomCreators = {}

connectDB()
.then( () => {
    app.on("error" , (error) => {
        console.log("Errror: ", error);
        throw error
    })

    io.on('connection',(socket) => {

        socket.on('createRoom',(roomCode) => {
            socket.join(roomCode)
            roomCreators[roomCode] = socket.id
            console.log(`Room created: ${roomCode} by ${socket.id}`)
            
            const clients = io.sockets.adapter.rooms.get(roomCode);
            console.log(`Clients in room ${roomCode} after creating room:`, clients ? Array.from(clients) : []);
        })

        socket.on('joinRoom',(roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} joined room: ${roomCode}`);
            io.to(roomCode).emit('message', 'A new user has joined the room');
            
            // Log all clients in the room
            const clients = io.sockets.adapter.rooms.get(roomCode);
            console.log(`Clients in room ${roomCode} after joining:`, clients ? Array.from(clients) : []);
        })

        socket.on('chatMessage',({roomCode , message}) => {
            console.log(`Server received message: ${message} for room: ${roomCode}`);
            io.to(roomCode).emit('message', message)
            console.log(`Message sent to room ${roomCode}: ${message}`)
        })

        socket.on('leaveRoom',() => {
            console.log("User disconnected");

            for(const [roomCode , creatorId] of Object.entries(roomCreators)) {
    
                if(creatorId === socket.id) {
                io.to(roomCode).emit('message' , 'The room creator has left. The room will be closed')
                io.socketsLeave(roomCode)
                delete roomCreators[roomCode]
                console.log(`Room destroyed: ${roomCode}`)
                }
            }
        })
    })



    server.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    })
})
.catch( ( err ) => {
    console.log("MongoDb connection failed !!!", err)
})
