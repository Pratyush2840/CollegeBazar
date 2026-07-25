import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } 
  catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

};

export default authMiddleware;
