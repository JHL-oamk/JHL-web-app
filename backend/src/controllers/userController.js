const { createUser, getUser } = require('../services/userService.js');

const createUserController = async (req, res) => {
  try {
    const { uid, ...data } = req.body;
    await createUser(uid, data);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await getUser(req.params.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUserController, getUserController };