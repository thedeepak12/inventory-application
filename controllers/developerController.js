const Developer = require('../models/developer');
const pool = require('../config/database');

exports.developer_create_get = (req, res) => {
  res.render('developers/new');
};

exports.developer_create_post = async (req, res) => {
  try {
    const { name, image_url, ADMIN_KEY } = req.body;
    
    if (!name) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Name is required' });
      }
      return res.status(400).render('developers/new', { 
        error: 'Name is required',
        name: name || '',
        image_url: image_url || ''
      });
    }
    
    if (!ADMIN_KEY || ADMIN_KEY !== process.env.ADMIN_KEY) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(403).json({ error: 'Invalid admin key' });
      }
      return res.status(403).render('developers/new', { 
        error: 'Invalid admin key',
        name: name || '',
        image_url: image_url || ''
      });
    }
    
    const newDeveloper = await Developer.create(name, image_url);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json(newDeveloper);
    }
    
    res.redirect(`/developers/${newDeveloper.id}`);
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
      title: `Developer: ${developer.name}`,
      developer
    });
  } catch (err) {
    console.error('Error fetching developer:', err);
    res.status(500).send('Server Error');
  }
};

exports.developer_delete = async (req, res) => {
  try {
    const { ADMIN_KEY } = req.body;
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Invalid admin key' });
    }
    
    const developerId = req.params.id;
    const deleted = await Developer.delete(developerId);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }
    
    return res.json({ success: true, message: 'Developer deleted successfully' });
  } catch (err) {
    console.error('Error deleting developer:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting developer',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.developer_update_get = async (req, res) => {
  try {
    const developer = await Developer.getById(req.params.id);
    if (!developer) {
      return res.status(404).send('Developer not found');
    }
    
    res.render('developers/edit', {
      title: `Edit ${developer.name}`,
      developer
    });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Server Error');
  }
};

exports.developer_update_post = async (req, res) => {
  try {
    const { name, image_url, ADMIN_KEY } = req.body;
    const developerId = req.params.id;
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).send('Invalid admin key');
    }
    
    if (!name) {
      return res.status(400).send('Name is required');
    }
    
    const updatedDeveloper = await Developer.update(developerId, { name, image_url: image_url || null });
    
    if (!updatedDeveloper) {
      return res.status(404).send('Developer not found');
    }
    
    res.redirect(`/developers/${developerId}`);
  } catch (err) {
    console.error('Error updating developer:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};