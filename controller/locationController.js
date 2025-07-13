const { location, user } = require('../models');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await location.findAll({
      attributes: [
        'location_id', 'provider_id', 'name', 'type', 'address', 'latitude', 'longitude'
      ]
    });
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { provider_id, name, type, address, latitude, longitude } = req.body;
    if (!provider_id || !name || !type) {
      return res.status(400).json({ message: 'provider_id, name, and type are required' });
    }
    const newLocation = await location.create({
      provider_id,
      name,
      type,
      address,
      latitude,
      longitude
    });
    res.status(201).json({ message: 'Location created', location: newLocation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLocationsByProvider = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Cek apakah user dengan user_id adalah provider
    const foundUser = await user.findByPk(user_id);
    if (!foundUser || foundUser.role !== 'provider') {
      return res.status(403).json({ message: 'User is not a provider or not found' });
    }

    // Ambil semua lokasi milik provider ini
    const locations = await location.findAll({
      where: { provider_id: user_id },
      attributes: [
        'location_id', 'provider_id', 'name', 'type', 'address', 'latitude', 'longitude'
      ]
    });

    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};