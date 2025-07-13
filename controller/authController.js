require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models'); // pastikan path sesuai struktur project
// ganti dengan secret yang aman
const JWT_SECRET = process.env.JWT_SECRET;
exports.register = async (req, res) => {
  try {
    const { username, password, role, fullname, email, address, phone, photo } = req.body;
    if (!username || !password || !fullname || !address || !phone) {
      return res.status(400).json({ message: 'Username, password, fullname, address, and phone are required' });
    }
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      username,
      password: hashedPassword,
      role: role || 'citizen',
      photo: photo || null,
      fullname,
      email: email || null,
      address,
      phone
    });
    res.status(201).json({
      message: 'User registered',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        role: newUser.role,
        photo: newUser.photo,
        fullname: newUser.fullname,
        email: newUser.email,
        address: newUser.address,
        phone: newUser.phone
      }
    });
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
    const token = jwt.sign({ user_id: foundUser.user_id, role: foundUser.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: foundUser.user_id,
        username: foundUser.username,
        role: foundUser.role,
        photo: foundUser.photo,
        fullname: foundUser.fullname,
        email: foundUser.email,
        address: foundUser.address,
        phone: foundUser.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('[getProfile] req.user:', req.user); // DEBUG: cek isi req.user
    const userId = req.user && req.user.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user_id not found in token' });
    }
    const foundUser = await user.findByPk(userId, {
      attributes: [
        'user_id', 'username', 'role', 'photo',
        'fullname', 'email', 'address', 'phone'
      ]
    });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: foundUser });
  } catch (err) {
    console.error('[getProfile] Error:', err); // DEBUG: log error detail
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};