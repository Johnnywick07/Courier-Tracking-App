import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  //checks if token exists 
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    //verifies if token is real using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //finds the user the token belongs to and attaches it to the request (without the password)
    req.user = await User.findById(decoded.id).select("-password");

    //checks if user exists in database 
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    //moves to the next route if user is authentic
    next();
  } catch (err) {
    //if token is fake or expired, returns an error message 
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};