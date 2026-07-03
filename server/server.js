const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("../config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;

// Load Login Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

// Login Route
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    res.json({
        success: true,
        message: "Login request received successfully!"
    });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});