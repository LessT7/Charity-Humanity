import jwt from "jsonwebtoken";

// Secret key untuk menandatangani JWT (gunakan environment variable untuk keamanan)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Durasi token (misalnya 1 hari)
const TOKEN_EXPIRATION = "1d";

// Fungsi untuk membuat JWT
export const createJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

// Fungsi untuk memverifikasi JWT
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error.message);  
    throw new Error("Invalid or expired token");
  }
};
