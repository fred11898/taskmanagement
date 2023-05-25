const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    login: {
        type: Date
    },
    logout: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

 
const Log = mongoose.model("Log", logSchema);
 module.exports = Log;