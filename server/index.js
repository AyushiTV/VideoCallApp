const path = require("path");
const { createServer } = require("http");

const express = require("express");
const { getIO, initIO } = require("./socket");

const app = express();

app.use("/", express.static(path.join(__dirname, "static")));

const httpServer = createServer(app);

let port = process.env.PORT || 3500;

initIO(httpServer);

httpServer.listen(port);
console.log("Server started on ", port);

getIO();
//...........
// const io = socketio(httpServer);
// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("message", (message) => {
//     console.log("message:", message);
//     io.emit("message", message);
//   });
//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//   });
// });

// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const port = process.env.PORT || 3500;

// const connectedUsers = {};

// io.on("connection", (socket) => {
//   socket.on("join", (userId) => {
//     connectedUsers[userId] = socket.id;
//     console.log(`User ${userId} connected.`);
//   });

//   socket.on("chatMessage", (data) => {
//     const { senderId, receiverId, text } = data;
//     const receiverSocket = connectedUsers[receiverId];

//     if (receiverSocket) {
//       io.to(receiverSocket).emit("chatMessage", { senderId, text });
//     }
//   });

//   socket.on("disconnect", () => {
//     // Handle user disconnection
//     // You can remove the user from connectedUsers, log, etc.
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

/////////.......................
// const { Server } = require("socket.io");
// let IO;

// module.exports.initIO = (httpServer) => {
//   IO = new Server(httpServer);

//   IO.use((socket, next) => {
//     if (socket.handshake.query && socket.handshake.query.callerId) {
//       let callerId = socket.handshake.query.callerId;
//       socket.user = callerId;
//       next();
//     } else {
//       // Handle missing callerId or other validation if needed
//       next(new Error("Missing callerId"));
//     }
//   });

//   IO.on("connection", (socket) => {
//     console.log(`${socket.user} Connected`);
//     socket.join(socket.user);

//     socket.on("call", (data) => {
//       let calleeId = data.calleeId;
//       let rtcMessage = data.rtcMessage;

//       socket.to(calleeId).emit("newCall", {
//         callerId: socket.user,
//         rtcMessage: rtcMessage,
//       });
//     });

//     socket.on("answerCall", (data) => {
//       let callerId = data.callerId;
//       let rtcMessage = data.rtcMessage;

//       socket.to(callerId).emit("callAnswered", {
//         callee: socket.user,
//         rtcMessage: rtcMessage,
//       });
//     });

//     socket.on("ICEcandidate", (data) => {
//       let calleeId = data.calleeId;
//       let rtcMessage = data.rtcMessage;

//       socket.to(calleeId).emit("ICEcandidate", {
//         sender: socket.user,
//         rtcMessage: rtcMessage,
//       });
//     });
//   });
// };

// module.exports.getIO = () => {
//   if (!IO) {
//     throw Error("IO not initialized.");
//   } else {
//     return IO;
//   }
// };
