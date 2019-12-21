import WebSocket from "ws";
import "./utils";

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
  port: 1248
});

interface End {
  ws: WebSocket;
  intentFilters?: [{ action: string }];
  name: string;
}

interface Intent {
  action: string;
  data: any;
}

const ends: End[] = [];

wss.on("listening", function() {
  console.log("[SERVER] listening");
  require("./ends/dataLogger");
});

wss.on("connection", function(ws) {
  console.log(`[SERVER] connection()`);
  ws.on("close", close);
  ws.on("message", message);
  let current: End;

  function message(message: string) {
    console.log("[SERVER] Received", message);
    const intent: Intent = JSON.parse(message);
    const { action } = intent;
    if (action) {
      if (action === "register") {
        current = {
          ws,
          intentFilters: intent.data.intentFilters,
          name: intent.data.name
        };
        ends.push(current);
        return;
      }
      console.log("ends", getEndsLog(ends));
      ends
        .filter(e => {
          return (
            e.intentFilters &&
            e.intentFilters.length > 0 &&
            e.intentFilters.find(filter => filter.action === action)
          );
        })
        .map(e => {
          e.ws.send(message, err => {
            if (err) {
              console.log("err", err);
            }
          });
        });
    }
  }
  function close() {
    console.log("[SERVER] Close", current && current.name);
    // @ts-ignore
    ends.remove(current);
    console.log("[SERVER] Close", "after close", getEndsLog(ends));
  }
});

function getEndsLog(ends: End[]) {
  return JSON.stringify(ends.map(({ ws, ...others }) => others));
}
