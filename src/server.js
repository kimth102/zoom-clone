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

// function handleConnection(socket) {
//   console.log(socket);
// }

wss.on("connection", (socket) => {
  console.log("connected to browser");
  socket.on("close", () => {
    console.log("disconnected from the browser");
  });
  socket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });
  socket.send("hello");
});

server.listen(3000, handleListen);
