import jwt from "jsonwebtoken";

// Fungsi untuk membuat JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" } // Token berlaku selama 1 jam
  );
};

// Fungsi untuk memverifikasi JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
