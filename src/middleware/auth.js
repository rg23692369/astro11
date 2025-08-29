import jwt from "jsonwebtoken";

export const authRequired = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed token" });
    }

    const token = authHeader.slice(7); // remove "Bearer "
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
