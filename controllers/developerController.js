const Developer = require('../models/developer');
const pool = require('../config/database');

exports.developer_create_get = (req, res) => {
  res.render('developers/new');
};

exports.developer_create_post = async (req, res) => {
  try {    
    return res.status(403).send('Invalid admin key');
  } catch (err) {
    console.error('Error creating developer:', err);
    res.status(500).send('Server Error');
  }
};

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