const users = []
//ADDUSER
const addUser = ({id, username, room})=>{
     username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    if(!username && room){
        return {
            error:'Username and room are required!'
        }
    }

     const existingUser =  users.find((user)=>{
       return  user.username === username && user.room === room
     })    
     if(existingUser){
         return {
             error:'Username already exists!'
         }
     }
   
     const user = {id, username, room}
     users.push(user)
     return user
    }

//REMOVE USER
    const removeUser = (id)=>{
 const index = users.findIndex((user)=> user.id === id)
    if(index !== -1){
  return users.splice(index,1)[0]
    }
}

//GET USER BY ID
 const getUser = (id)=>{
     const user = users.find((user)=>user.id === id)
     if(!user){
         return {
             error:'User not found!'
         }
     }
       return user
    }

//GET USERS IN ROOM
const getRoomUsers = (room)=>{
    room = room.trim().toLowerCase()
   const roomUsers = users
  .filter((user)=>user.room === room)
   return roomUsers
}
 
module.exports = {
                  addUser,
                  removeUser,
                  getUser,
                  getRoomUsers,
                  }





