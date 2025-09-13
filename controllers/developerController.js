const Developer = require('../models/developer');
const pool = require('../config/database');

exports.developer_create_get = (req, res) => {
  res.render('developers/new');
};

exports.developer_create_post = async (req, res) => {
  try {
    let developerData;
    
    if (req.headers['content-type'] === 'application/json') {
      developerData = req.body;
    } else {
      const { name, image_url, ADMIN_KEY } = req.body;
      
      if (ADMIN_KEY !== process.env.ADMIN_KEY) {
        return res.status(403).send('Invalid admin key');
      }
      
      if (!name) {
        return res.status(400).send('Name is required');
      }
      
      developerData = { name, image_url };
    }
    
    const newDeveloper = await Developer.create(developerData);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json(newDeveloper);
    } else {
      res.redirect(`/developers/${newDeveloper.id}`);
    }
  } catch (err) {
    console.error('Error creating developer:', err);
    res.status(500).send(`Server Error: ${err.message}`);
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