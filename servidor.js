const express = require("express");
const app = express();
let allMessages = [];

// configs
app.set("port", process.env.PORT || 4000);
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// server on:
const server = app.listen(app.get("port"), () =>{
  console.log(`Server on port ${app.get("port")}`)
})

//socket: le paso el server como parametro para que lo escuche..
const SocketIO = require('socket.io');
const io = SocketIO(server)
io.on('connection', (socket) =>{
  console.log("a client has been connected:", socket.id)
  socket.emit("chat:allmessages", allMessages)


  socket.on("chat:union", (data)=>{
    io.sockets.emit("chat:union", (data))
  })

  socket.on("chat:message", (message)=>{
    io.sockets.emit("chat:message",message)
    allMessages.push(message)
  })

  socket.on("user:typing", (user)=>{
    socket.broadcast.emit("user:typing",user)
  })
}) 