const { admin } = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader ? "exists" : "missing");
  
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("TOKEN VERIFIED:", decoded.uid);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("TOKEN ERROR:", error.code, error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };