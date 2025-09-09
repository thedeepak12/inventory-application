const Developer = require('../models/developer');

exports.developer_list = async (req, res) => {
  try {
    const developers = await Developer.getAll();
    res.render('developers/index', { 
      title: 'All Developers', 
      developers 
    });
  } catch (err) {
    console.error('Error fetching developers:', err);
    res.status(500).send('Server Error');
  }
};

exports.developer_detail = async (req, res) => {
  try {
    const developer = await Developer.getById(req.params.id);
    if (!developer) {
      return res.status(404).send('Developer not found');
    }
    res.render('developers/detail', { 
      title: developer.name, 
      developer 
    });
  } catch (err) {
    console.error('Error fetching developer details:', err);
    res.status(500).send('Server Error');
  }
};