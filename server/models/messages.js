const mongoose = require("mongoose");

const MessageModel = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Number,
            required: true
        }
    },
    {
        collection: "messages"
    }
)

const model = mongoose.model("MessageModel", MessageModel)

module.exports = model;