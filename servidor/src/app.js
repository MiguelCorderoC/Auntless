import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";

const app = express();
app.use(cors());
app.use(morgan("dev"));

const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", (socket) => {
  socket.on("message", ({ body, from }) => {
    console.log();
    console.log("Socket ID: " + from);
    console.log("Message: " + body);
    socket.broadcast.emit("message", {
      body,
      from,
    });
  });
});

server.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
