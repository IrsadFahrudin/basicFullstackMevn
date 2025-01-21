import express from "express";
import db from "./db.js";

const router = express.Router();

// Route Khusus Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan." });
        }

        // Jika username dan password sesuai, kembalikan username dan role
        if (result.length > 0) {
            const users = result[0];
            res.json({ success: true, message: "Login berhasil.", username: users.username, role: users.role });
        } else {
            res.json({ success: false, message: "Username atau password salah." });
        }
    });
});


export default router;