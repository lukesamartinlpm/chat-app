const app = require('./app')
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessageTime} = require('./utils/timesstamp')
const {
    addUser,
    removeUser,
    getUser,
    getRoomUsers,
    } = require('./utils/users')
const { generateKeyPair } = require('crypto')
const filter = new Filter

const io = socketio(server)

io.on('connection',(socket)=>{
    //JOIN
     socket.on('join',(options,callback)=>{
        const user = addUser({
            id:socket.id,
            ...options
        })
        socket.join(user.room)
        if(user.error){
        return callback('user already used!')
        }
        socket.emit('connected',generateMessageTime('Welcome',user.username))
       socket.broadcast.to(user.room).emit('newUser',
        generateMessageTime(`Connected`,user.username))
     //roomSidebar
        io.to(user.room)
        .emit('room',getRoomUsers(user.room))
    
    })
    
    
    
    

 //SEND MESSAGE
 socket.on('sendMessage',(msg,callback)=>
 {    const user = getUser(socket.id)
     if(filter.isProfane(msg)){
      return socket.emit('sendMsgClient','Profanity is not allowed!')
}
     io.to(user.room)
     .emit('sendMsg',generateMessageTime(msg,user.username))  
     callback('delivered')
 })
    //SEND LOCATION
    socket.on('sendLocation',(position,callback)=>{
        const user = getUser(socket.id)
        callback('Location shared!')
         io.to(user.room)
      .emit('locationMsg',generateMessageTime(
        `https://google.com/maps?q=${position[1]},${position[0]}`,
        user.username)
      )
    })
   
   //DISCONNECT
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
        io.emit('newUser',
            generateMessageTime(`User disconnected`,user.username))
        }
})
})



module.exports = server
