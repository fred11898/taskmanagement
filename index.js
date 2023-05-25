require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");

const PORT = process.env.PORT || 5000;

// models
const Member = require("./model/MemberModel");
const User = require("./model/UserModel");
const Department = require("./model/Department");
const Task = require("./model/TaskModel"); 

// Routes
const UserRoutes = require("./router/userRouter");
const authenticationRoutes = require("./router/Authentication");

mongoose.connect(process.env.CONNECTION_STRING + process.env.DB_NAME, {useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) =>console.log(error));
db.once("open", () => console.log("Database Successfully Connected . . . . "));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);

app.use("/api", authenticationRoutes);

app.use(auth)

app.use("/api/user", UserRoutes);

// API for members

app.get("/api/members", async (req, res) => {
    const members = await Member.find({})
    .populate("user")
    .populate("department")
    .sort({createdAt: -1})
    .limit(20);
    res.status(200).send(members);
});

app.get("/api/members/:id", async(req, res) => {
    const member = await Member.findById(req.params.id)
    .populate("user")
    .populate("department");

    if (!member) {
        return res.status(404).send("Not Found");
    }
    res.status(200).send(member);
});

app.post("/api/create", async(req, res) => {
    const { first_name, last_name, birthday, username, password, role, department_name } = req.body;
        if (!password) {
            return res.status(400).json({error: "Password is required"});
        }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashPassword, role });
    
        const newDepartment = await Department.create({ department_name });

        const newMember = await Member.create({
            first_name,
            last_name,
            birthday,
            user: [newUser._id],
            department: [newDepartment._id]
        });

        res.status(201).send(newMember);
    } catch(error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


app.put("/api/member/:id", async(req, res) => {
    const {
        first_name,
        last_name,
        birthday,
        username,
        password,
        role,
        department_name
    } = req.body;


    try {
        const hashPassword = await bcrypt.hash(password, 10)

        const member = await Member.findById(req.params.id)
        .populate("user")
        .populate("department");
        const user = await User.findById(member.user);
        const department = await Department.findById(member.department);

        if(!member) {
            return res.status(404).send("member not found");
        }

        if (first_name) member.first_name = first_name;
        if (last_name) member.last_name = last_name;
        if (birthday) member.birthday = birthday;
        if (user) {
            if (username !== undefined) member.user.username = username;
            if (hashPassword !== undefined) member.user.password = hashPassword;
            if (role !== undefined) member.user.role = role;
            await member.user.save();
        }
        if (department) {
            if (department_name !== undefined) member.department.department_name = department_name;
            await member.department.save();
        }

        await member.save();

        res.status(200).send(member);
    } catch(error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
});

app.delete("/api/remove-members/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member){
            return res.status(404).send("Member not found");
        }

        await member.deleteOne();

        res.status(200).send("Member Remove Successfully...");
    } catch(error) {
        res.status(500).send("Server Error");
    }
});

// API for TASKS

app.get("/api/task", async (req, res) => {
    const task = await Task.find({})
    .populate("member")
    .sort({createdAt: -1})
    .limit(20);
    res.status(200).send(task);
});

app.get("/api/task/:id", async(req, res) => {
    const task = await Task.findById(req.params.id)
    .populate("member");

    if (!task) {
        return res.status(404).send("Not Found");
    }
    res.status(200).send(task);
});

app.get("/api/task-assigned/:memberId", async (req, res) => {
    try {
        const memberId = req.params.memberId;

        const task = await Task.find({ member: memberId })
        .exec();

        if(!task || task.length === 0){
            return res.status(404).send("This task is not yet assigned");
        }
        res.status(200).send(task);
    } catch(error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post("/api/create-task", async(req, res) => {
    const { difficult, priority, difficult_status, priority_status } = req.body;

    try {
        const memberId = req.body.member || Member._id;
    
        const newTask = await Task.create({
            difficult,
            priority,
            difficult_status,
            priority_status,
            member: [memberId],
        });

        res.status(201).send(newTask);
    } catch(error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


app.put("/api/task-update/:id", async(req, res) => {
    const {
        difficult,
        priority,
        difficult_status,
        priority_status,
    } = req.body;


    try {

        const task = await Task.findById(req.params.id)
        .populate("member");

        if (difficult) task.difficult = difficult;
        if (priority) task.priority = priority;
        if (difficult_status) task.difficult_status = difficult_status;
        if (priority_status) task.priority_status = priority_status;
        await task.save();

        res.status(200).send(task);
    } catch(error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
});

app.delete("/api/delete-task/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task){
            return res.status(404).send("Member not found");
        }

        await task.deleteOne();

        res.status(200).send("Member Remove Successfully...");
    } catch(error) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server Started in ${PORT} ...`)
});
