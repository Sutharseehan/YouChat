const WebSocket = require("ws")
const { processMessage } = require("./utilities")

export default function setupWebSocketServer() {
    const wss = new WebSocket.Server({
        port: 1338
    })

    wss.on("connection", function connect(ws) {
        // a single client has joined

        ws.on("message", function incoming(payload) {
            const message = processMessage(message)
        })

        ws.send(":something")
    })
}