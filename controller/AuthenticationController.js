const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const UserToken = require("../model/UserToken");
const Log = require("../model/Log");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("Invalid Credential");
    }

    let hashPassword = user.password;
    let userId = user.id;

    if (await bcrypt.compare(password, hashPassword)) {
      const accessToken = jwt.sign(username, process.env.AUTH_TOKEN_SECRET);

      const loginLog = new Log({
        user: userId,
        login: new Date(),
      });

      await loginLog.save();

      saveToken(userId, accessToken);
      res.status(200).json({
        message: "Successfully authenticated",
        access_token: accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid Credential" });
    }
  } catch (error) {
    throw error;
  }
};

const saveToken = async (userId, access_token) => {
  const token = await UserToken.findOne({
    userId: userId,
    token: access_token,
  });

  if (!token) {
    await UserToken.create({
      userId: userId,
      token: access_token,
    });
  }
};

const logoutUser = async (req, res) => {
  const { user_id, access_token } = req.body;

  try {
    await UserToken.findOneAndDelete({ userId: user_id, token: access_token });

    const logoutLog = new Log({
      user: user_id,
      logout: new Date(),
    });
    await logoutLog.save();

    res.status(200).json({ message: "Log out successfully" });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginUser,
  logoutUser,
};
