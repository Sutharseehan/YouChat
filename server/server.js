const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose");
const User = require("./models/user")

const app = express()

mongoose.connect("mongodb://localhost:27017/groupchatapp", { useNewUrlParser: true, useUnifiedTopology: true })

if (process.env.NODE_ENV !== "production") {
    app.use(cors())
}

app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("ok")
})

app.post("/api/register", async (req, res) => {
    console.log(req.body)

    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ status: "error", error: "Invalid email/password" })
    }

    try {
        const user = new User({ email, password })
        await user.save()
    } catch (error) {
        console.log("Error", error)
        res.json({ status: "error", error: "Duplicate email" })
    }


    res.json({ status: "goodbye" })
})

app.listen(1337)