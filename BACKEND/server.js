// =====================================================
// NOAH'S ARK INTERNATIONAL SCHOOL
// ADMISSIONS BACKEND SERVER
// File: server.js
// =====================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/database");

const programmeRoutes = require("./routes/programmeRoutes");

const adminTestRoutes = require('./routes/adminTestRoutes');

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminApplicationRoutes = require('./routes/adminApplicationRoutes');
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();
// =====================================================
// 01. SECURITY AND MIDDLEWARE
// =====================================================

app.use(helmet());

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "https://benykayinamura67-cmd.github.io"
    ]
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin', adminApplicationRoutes);
// =====================================================
// 02. PROGRAMMES API ROUTES
// =====================================================

app.use("/api/programmes", programmeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminTestRoutes);
// =====================================================
// 02. HOMEPAGE ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to Noah's Ark Admissions API"
    });

});

// =====================================================
// 03. DATABASE HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.status(200).json({
            success: true,
            message: "Backend and PostgreSQL are connected.",
            database: process.env.DB_NAME,
            serverTime: result.rows[0].current_time
        });

} catch (error) {

    console.error("--------------------------------");
    console.error("DATABASE CONNECTION ERROR");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("--------------------------------");

    res.status(500).json({
        success: false,
        message: "Database connection failed.",
        errorCode: error.code || "UNKNOWN",
        error: error.message
    });

}

});


 // =====================================================
 // 04. START SERVER
 // =====================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("------------------------------------------");
        console.log("NOAH'S ART BY DERRICK BACKEND");
        console.log("------------------------------------------");
        console.log("PostgreSQL connected successfully.");
        console.log("Database:", process.env.DB_NAME);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error("PostgreSQL connection failed.");
        console.error("Error code:", error.code);
        console.error("Error:", error.message);
        process.exit(1);
    }
}

startServer();
