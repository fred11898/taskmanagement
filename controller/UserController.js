const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

const getAllUser = async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user);
    } catch (error) {
        throw error
    };
};

const getUser = async (req, res) => {
    const id  = req.params.id;

    try {
        const user = await User.findById(id);
        res.json(user);
    } catch(error) {
        throw error
    };
};

const createUser = async (req, res) => {
    const { username, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10)

    try {
        const user = User.create({
            username: username,
            password: hashPassword,
            role: role
        });

        if (user){
            res.status(201).json({msg: `Data inserted successfully`});
        } else {
            res.status(400).json({msg: "Data not inserted"});
        }
    } catch (error) {
        if (error.code === 1100) {
            res.status(409).json({ msg: "Username Already Exist" });
        } else {
            res.status(500).json({ msg: "Server Error" });
        }
    }
};

const updateUser = async (req, res) => {
    const { username, password, role, id} = req.body;

    try {
        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({msg: "User not found" });
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
        }

        if (role) {
            user.role = role;
        }

        await user.save();

        res.status(200).json({msg: `Data Successfully updated with id ${user._id}`});
    } catch(error) {
        console.err(error);
        res.status(500).json({msg: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await User.findByIdAndDelete(id);

        if (user) {
            res.status(200).json({msg: `Data Deleted with id ${user._id}` });
        } else {
            res.status(400).json({msg: "Data not updated"});
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getUser,
    getAllUser,
    createUser,
    updateUser,
    deleteUser
};