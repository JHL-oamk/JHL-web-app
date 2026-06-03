const { getTopLaws } = require('../services/adminService');

const getTopLawsController = async (req, res) => {
  try {
    const top = await getTopLaws(5);
    res.json(top);
  } catch (error) {
    console.error('getTopLawsController error', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTopLawsController };
