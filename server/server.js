// const express = require("express")
// const bodyParser = require("body-parser")
// const cors = require("cors")
// const mongoose = require("mongoose");
// const User = require("./models/user");
// const jwt = require("jsonwebtoken")
// const setupWebSocketServer = require("./websocket")

// const app = express();

// const JWT_SECRET_TOKEN = "siufhsdiufhsiwuhdfiushdfiusdhfiusdh435345fidsuhfdsiuhf"

// mongoose.connect("mongodb://localhost:27017/groupchatapp", { useNewUrlParser: true, useUnifiedTopology: true })

// if (process.env.NODE_ENV !== "production") {
//     app.use(cors())
// }

// app.use(bodyParser.json())

// app.get("/", (req, res) => {
//     res.send("ok")
// })

// app.post("/api/register", async (req, res) => {
//     console.log(req.body)

//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.json({ status: "error", error: "Invalid email/password" })
//     }

//     try {
//         const user = new User({ email, password })
//         await user.save()
//     } catch (error) {
//         console.log("Error", error)
//         res.json({ status: "error", error: "Duplicate email" })
//     }


//     res.json({ status: "ok" })
// })

// app.post("/api/login", async (req, res) => {
//     console.log(req.body)

//     const { email, password } = req.body

//     const user = await User.findOne({ email, password });

//     console.log(user)

//     if (!user) {
//         return res.json({ status: "error", error: "User not found" })
//     }

//     const payload = jwt.sign({ email }, JWT_SECRET_TOKEN)


//     return res.json({ status: "ok", data: payload })

// })

// app.listen(1337)

// setupWebSocketServer();




const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken")
const webSocketServerFile = require("./websocket")
const utilities = require("./utilities")

const app = express();



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


    res.json({ status: "ok" })
})

app.post("/api/login", async (req, res) => {
    console.log(req.body)

    const { email, password } = req.body

    const user = await User.findOne({ email, password });

    console.log(user)

    if (!user) {
        return res.json({ status: "error", error: "User not found" })
    }

    const payload = jwt.sign({ email }, utilities.JWT_SECRET_TOKEN)


    return res.json({ status: "ok", data: payload })

})

app.listen(1337)

webSocketServerFile.setupWebSocketServer();
webSocketServerFile.setupWebSocketServerThing();