import http from "http";
import WebSocket from "ws";
import express from "express";
import { log } from "console";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http server
const server = http.createServer(app);

// websocket server
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "anon";
  console.log("connected to browser");

  socket.on("close", () => {
    console.log("disconnected from the browser");
  });

  socket.on("message", (message) => {
    const messageObject = JSON.parse(message.toString());
    switch (messageObject.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}: ${messageObject.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = messageObject.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
