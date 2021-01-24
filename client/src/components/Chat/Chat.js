import React, { useEffect } from "react"

export default function Chat() {

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:1338")
        ws.addEventListener("open", () => {
            ws.send(JSON.stringify({ status: "ok" }))
        }, { once: true })
    }, [])

    return (
        <div className="chat-background">
            <h1>Chat Page</h1>
        </div>
    )
}