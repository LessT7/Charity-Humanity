import { verifyJWT } from "../../utils/jwt";

export default function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded; // Tambahkan data user ke request
    return res.status(200).json({ message: "Authorized", user: decoded });
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
