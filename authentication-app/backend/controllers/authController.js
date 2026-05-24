const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── POST /api/auth/register (sign in cycle &tested with postman)
const register = async (req, res) => {
  console.log('REGISTER BODY:', req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ username, email, route: password });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/auth/login (log in cycle)
const login = async (req, res) => {
  console.log('LOGIN BODY:', req.body);
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and route are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No account found for that email' });

    const match = await user.matchRoute(password);
    if (!match)
      return res.status(401).json({ message: 'Wrong route — try again' });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };