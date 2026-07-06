const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();


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

    // 1. Check if user exists
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.json({
                success: false,
                message: "Database error"
            });
        }

        // 2. If user not found
        if (results.length === 0) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        // 3. Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Success login
        return res.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });

    });

});

// Dashboard Statistics
app.get("/api/dashboard/stats", (req, res) => {

    const dashboardData = {};

    // Total Guards
    db.query(
        "SELECT COUNT(*) AS totalGuards FROM guards",
        (err, guardResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            dashboardData.totalGuards =
                guardResult[0].totalGuards;

           // Active Guards
db.query(
    "SELECT COUNT(*) AS activeGuards FROM guards WHERE status='Active'",
    (err, activeResult) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

       dashboardData.activeGuards = activeResult[0].activeGuards;
        
                    

    // Inactive Guards
db.query(
    "SELECT COUNT(*) AS inactiveGuards FROM guards WHERE status='Inactive'",
    (err, inactiveResult) => {

        if (err) {

            return res.status(500).json({
                success:false,
                message:"Database Error"
            });

        }

        dashboardData.inactiveGuards =
            inactiveResult[0].inactiveGuards;

            

        // Incidents
        db.query(
            "SELECT COUNT(*) AS totalIncidents FROM incidents",
            (err, incidentResult) => {

                if (err) {

                    return res.status(500).json({
                        success:false,
                        message:"Database Error"
                    });

                }

                dashboardData.totalIncidents =
                    incidentResult[0].totalIncidents;

                res.json({
                    success:true,
                    stats:dashboardData
                });

            });

    });

                });

        });

});

// Add Guard
app.post("/api/guards", (req, res) => {

    const {
        fullName,
        phone,
        email,
        address,
        status
    } = req.body;

    const sql = `
        INSERT INTO guards
        (full_name, phone, email, address, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullName, phone, email, address, status],
        (err, result) => {

            if (err) {

                return res.json({
                    success:false,
                    message:"Failed to add guard."
                });

            }

            res.json({
                success:true,
                message:"Guard added successfully!"
            });

        });

});

// Get All Guards
app.get("/api/guards", (req, res) => {

    db.query(
        "SELECT * FROM guards ORDER BY id ASC",
        (err, results) => {

            if (err) {

                return res.json({
                    success: false,
                    message: "Database error"
                });

            }

            res.json({
                success: true,
                guards: results
            });

        });

});

// Update Guard
app.put("/api/guards/:id", (req, res) => {

    const { id } = req.params;

    const {
        fullName,
        phone,
        email,
        address,
        status
    } = req.body;

    const sql = `
        UPDATE guards
        SET
            full_name=?,
            phone=?,
            email=?,
            address=?,
            status=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            fullName,
            phone,
            email,
            address,
            status,
            id
        ],
        (err) => {

            if (err) {

                return res.json({
                    success: false,
                    message: "Update failed."
                });

            }

            res.json({
                success: true,
                message: "Guard updated successfully!"
            });

        });

});

// Delete Guard
app.delete("/api/guards/:id", (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM guards WHERE id = ?",
        [id],
        (err) => {

            if (err) {

                return res.json({
                    success:false,
                    message:"Delete failed."
                });

            }

            res.json({
                success:true,
                message:"Guard deleted successfully!"
            });

        }
    );

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});