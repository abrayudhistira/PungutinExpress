require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models'); // pastikan path sesuai struktur project
// ganti dengan secret yang aman
const JWT_SECRET = process.env.JWT_SECRET;
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered', user: { id: newUser.id, username: newUser.username, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const foundUser = await user.findOne({ where: { username } });
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: foundUser.id, role: foundUser.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};