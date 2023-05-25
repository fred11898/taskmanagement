const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
}, {timestamps: true});


module.exports = mongoose.model("Member", memberSchema);