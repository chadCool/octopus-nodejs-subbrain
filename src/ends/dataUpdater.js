// 导入WebSocket模块:
const WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:1248/");
let data = {};

// 打开WebSocket连接后立刻发送一条消息:
ws.on("open", function() {
  console.log(`[CLIENT] open()`);
  ws.send(
    JSON.stringify({
      action: "update",
      data: { name: `world${Math.random()}` }
    })
  );
});
