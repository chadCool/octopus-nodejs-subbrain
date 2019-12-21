"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
require("./utils");
// 引用Server类:
var WebSocketServer = ws_1.default.Server;
// 实例化:
var wss = new WebSocketServer({
    port: 1248
});
var ends = [];
wss.on("listening", function () {
    console.log("[SERVER] listening");
    require("./ends/dataLogger");
});
wss.on("connection", function (ws) {
    console.log("[SERVER] connection()");
    ws.on("close", close);
    ws.on("message", message);
    var current;
    function message(message) {
        console.log("[SERVER] Received", message);
        var intent = JSON.parse(message);
        var action = intent.action;
        if (action) {
            if (action === "register") {
                current = {
                    ws: ws,
                    intentFilters: intent.data.intentFilters,
                    name: intent.data.name
                };
                ends.push(current);
                return;
            }
            console.log("ends", getEndsLog(ends));
            ends
                .filter(function (e) {
                return (e.intentFilters &&
                    e.intentFilters.length > 0 &&
                    e.intentFilters.find(function (filter) { return filter.action === action; }));
            })
                .map(function (e) {
                e.ws.send(message, function (err) {
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
function getEndsLog(ends) {
    return JSON.stringify(ends.map(function (_a) {
        var ws = _a.ws, others = __rest(_a, ["ws"]);
        return others;
    }));
}
