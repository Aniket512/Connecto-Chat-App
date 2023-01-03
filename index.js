const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoute");
const socket = require("socket.io");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

let activeUsers = [];

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
})
const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        if (!activeUsers.some((user) => user.userId === userId)) {
            activeUsers.push({ userId: userId, socketId: socket.id });
          }
          io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("get-users", activeUsers);
      });
    
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });

});
