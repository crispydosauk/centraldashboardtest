// controllers/authController.js
import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Use promise API: returns [rows, fields]
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const stored = user.password || "";

    // bcrypt hash or plain
    const isHash = /^\$2[aby]\$/.test(stored);
    const isMatch = isHash ? await bcrypt.compare(password, stored) : password === stored;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // remove sensitive fields
    const { password: _omitPwd, remember_token, deleted_at, ...safeUser } = user;

    return res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
