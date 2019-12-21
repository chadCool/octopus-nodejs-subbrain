// 导入WebSocket模块:
const WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:1248/");
let data = {};

// 打开WebSocket连接后立刻发送一条消息:
ws.on("open", function() {
  console.log(`[CLIENT] open()`);
  ws.send(
    JSON.stringify({
      action: "register",
      data: { intentFilters: [{ action: "update" }], name: "dataLogger" }
    })
  );
});

// 响应收到的消息:
ws.on("message", function(message) {
  console.log(`[CLIENT] Received: ${message}`);
  const intent = JSON.parse(message);
  if (intent.action === "update") {
    data = intent.data;
    console.log("data update", data);
  }
});
