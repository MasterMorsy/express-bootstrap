const jwt = require("jwt");

async function middlewareHandler(req, res, next) {
  const token = req.headers["Authorization"].split(" ")[1];

  if (jwt.verify(token)) next();
  else res.status(401).json({ message: "Access denied" });
}

export default middlewareHandler;
