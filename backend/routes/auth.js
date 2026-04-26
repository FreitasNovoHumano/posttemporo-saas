const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ACCESS_SECRET = "ACCESS_SECRET";
const REFRESH_SECRET = "REFRESH_SECRET";

/**
 * 🔐 LOGIN
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@email.com" || password !== "123456") {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = { id: 1 };

  const accessToken = jwt.sign(user, ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(user, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // 🍪 salva refresh token seguro
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true em produção (HTTPS)
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  res.json({ accessToken });
});

/**
 * 🔄 REFRESH TOKEN
 */
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).end();

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).end();
  }
});

/**
 * 🚪 LOGOUT
 */
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.end();
});

/**
 * 👤 ME
 */
router.get("/me", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).end();

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_SECRET);

    res.json({ id: decoded.id, name: "Fábio" });
  } catch {
    res.status(401).end();
  }
});

module.exports = router;