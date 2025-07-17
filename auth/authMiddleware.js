import { validateToken } from "../auth/authController.js";

const authenticateToken = (req, res, next) => {
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res
      .send({ success: false, message: "No token provided" })
      .status(401);
  }

  try {
    const decoded = validateToken(token);    
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res
        .send({ success: false, message: "Invalid or expired token" })
        .status(200);
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(403).send({ success: false, message: "Invalid token" });
  }
};

export default authenticateToken;