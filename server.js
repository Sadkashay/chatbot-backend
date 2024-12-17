const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let clients = [];

app.get("/chat", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

app.post("/send-message", (req, res) => {
  const message = req.body.message;
  broadcastMessage({ sender: "Bot", text: `You said: ${message}` });
  res.status(200).send();
});

function broadcastMessage(message) {
  clients.forEach((client) =>
    client.write(`data: ${JSON.stringify(message)}\n\n`)
  );
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
