const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema ({
    difficult: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    difficult_status: {
        type: String,
        required: true
    },
    priority_status: {
        type: String,
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Member"
    },
}, {timestamps: true});

module.exports = mongoose.model("Task", taskSchema);