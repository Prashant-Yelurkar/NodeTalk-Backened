import { validateToken } from "../auth/authController.js";
import User from "../model/userModel.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ success: false, message: "No token provided" });
  }

  try {
    const decoded = validateToken(token);
    const user = await User.findOne({ email: decoded.email });

    if (user.tokenVersion === decoded.tokenVersion) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).send({ success: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(403).send({ success: false, message: "Invalid token" });
  }
};

export default authenticateToken;
