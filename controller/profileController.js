const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { user } = require('../models');

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { username, password, fullname, email, address, phone } = req.body;
    let updateData = {};

    console.log('[editProfile] userId:', userId);
    console.log('[editProfile] req.body:', req.body);

    if (username) updateData.username = username;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      console.log('[editProfile] Password updated');
    }
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    // Handle photo upload
    if (req.file) {
      console.log('[editProfile] Photo uploaded:', req.file.filename);
      // Hapus foto lama jika ada
      const foundUser = await user.findByPk(userId);
      if (foundUser && foundUser.photo) {
        const oldPath = path.join(__dirname, '..', 'uploads', foundUser.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log('[editProfile] Old photo deleted:', foundUser.photo);
        }
      }
      updateData.photo = req.file.filename;
    }

    console.log('[editProfile] updateData:', updateData);

    const [affectedRows] = await user.update(updateData, { where: { user_id: userId } });
    console.log('[editProfile] affectedRows:', affectedRows);

    const updatedUser = await user.findByPk(userId, {
      attributes: [
        'user_id', 'username', 'role', 'photo',
        'fullname', 'email', 'address', 'phone'
      ]
    });

    console.log('[editProfile] updatedUser:', updatedUser);

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('[editProfile] Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};