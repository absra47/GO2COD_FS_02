import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("--- Inside protectRoute middleware ---");
    console.log("req.cookies:", req.cookies);
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access Token token Provided" });
    }
    console.log("accessToken found:", accessToken.substring(0, 20) + "..."); // Log part of it
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("JWT Decoded:", decoded); // What's inside the token? (userId should be here)
      const user = await User.findById(decoded.userId).select("-password");
      console.log("User fetched from DB:", user ? user.email : "Not Found"); // Did we find the user?
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      console.log("req.user populated with ID:", req.user._id); // Confirm req.user._id is set
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token Expired - Please Login Again" });
      }
      console.error(
        "JWT Verification/User Fetch Error in protectRoute:",
        error.message
      );
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied - Admin Only" });
  }
};
