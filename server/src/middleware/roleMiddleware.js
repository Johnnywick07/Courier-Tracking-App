// checks if the user has the required role to access a route
export const authorize = (...roles) => {
  return (req, res, next) => {
    //blocks access if user is not authenticated or does not have the required role
    if (!req.user || !roles.includes(req.user.role)) {
      //returns a 403 error if user does not have the required role
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};