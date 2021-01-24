const WebSocket = require("ws")
const processMessage = require("./utilities")

function setupWebSocketServer() {
    const wss = new WebSocket.Server({
        port: 1338
    })

    wss.on("connection", function connect(ws) {
        // a single client has joined

        ws.on("message", function incoming(payload) {
            const message = processMessage(payload)

            if (!message) {
                // corrupted message from client
                // ignore
                return
            }

            ws.send(JSON.stringify(message))
        })

        ws.send(":something")
    })
}

module.exports = setupWebSocketServer