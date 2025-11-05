// backend/src/controllers/admin/authcontroller.js
import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1) find user
    const [rows] = await db.execute(
      `SELECT id, role_id, name, email, password
         FROM users
        WHERE email=? AND deleted_at IS NULL
        LIMIT 1`,
      [email.trim()]
    );
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const ok = user.password ? await bcrypt.compare(password, user.password) : password === user.password;
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // 2) role meta
    let roleTitle = null;
    if (user.role_id) {
      const [r] = await db.execute(`SELECT title FROM roles WHERE id=? AND deleted_at IS NULL`, [user.role_id]);
      roleTitle = r.length ? r[0].title : null;
    }

    // 3) permissions for the role
    let permissions = [];
    if (user.role_id) {
      const [perms] = await db.execute(
        `SELECT LOWER(p.title) AS code
           FROM permission_role pr
           JOIN permissions p ON p.id = pr.permission_id
          WHERE pr.role_id=?`,
        [user.role_id]
      );
      permissions = perms.map((x) => x.code); // e.g. ["dashboard","order_management","help","access"]
    }

    // 4) sign token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, email: user.email },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "2d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_title: roleTitle,
      },
      permissions,
    });
  } catch (e) {
    console.error("auth.login:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
