import jwt from "jsonwebtoken";

// Middleware untuk memverifikasi token JWT
export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Ambil token dari header Authorization
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    req.user = decoded; // Simpan data user yang sudah didecode di req.user
    next(); // Lanjutkan ke route berikutnya
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


