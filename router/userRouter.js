const express = require("express");
const UserController = require("../controller/UserController");
const router = express.Router();

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUser);
router.post("/", UserController.createUser);
router.put("/", UserController.updateUser);
router.delete("/", UserController.deleteUser);

module.exports = router;