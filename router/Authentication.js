const express = require("express");
const router = express.Router();
const authenticationController = require("../controller/AuthenticationController");

router.post("/login", authenticationController.loginUser);
router.post("/logout", authenticationController.logoutUser);

module.exports = router;