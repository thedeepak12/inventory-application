const Genre = require('../models/genre');
const pool = require('../config/database');

exports.genre_create_get = (req, res) => {
  res.render('genres/new');
};

exports.genre_create_post = async (req, res) => {
  try {
    const { name, ADMIN_KEY } = req.body;
    
    if (!name) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Name is required' });
      }
      return res.status(400).render('genres/new', { 
        error: 'Name is required',
        name: name || ''
      });
    }
    
    if (!ADMIN_KEY || ADMIN_KEY !== process.env.ADMIN_KEY) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(403).json({ error: 'Invalid admin key' });
      }
      return res.status(403).render('genres/new', { 
        error: 'Invalid admin key',
        name: name || ''
      });
    }
    
    const newGenre = await Genre.create(name);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json(newGenre);
    }
    
    res.redirect(`/genres/${newGenre.id}`);
  } catch (err) {
    console.error('Error creating genre:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};

exports.genre_list = async (req, res) => {
  try {
    const genres = await Genre.getAll();
    res.render('genres/index', { 
      title: 'All Genres', 
      genres 
    });
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).send('Server Error');
  }
};

exports.genre_detail = async (req, res) => {
  try {
    const genre = await Genre.getById(req.params.id);
    
    if (!genre) {
      return res.status(404).send('Genre not found');
    }
    
    res.render('genres/detail', {
      title: `Genre: ${genre.name}`,
      genre
    });
  } catch (err) {
    console.error('Error fetching genre:', err);
    res.status(500).send('Server Error');
  }
};

exports.genre_delete = async (req, res) => {
  console.log('DELETE /genres/:id - Request received');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    const { ADMIN_KEY } = req.body;
    console.log('Received ADMIN_KEY:', ADMIN_KEY);
    console.log('Expected ADMIN_KEY:', process.env.ADMIN_KEY ? '*** (set)' : 'NOT SET');
    
    if (!ADMIN_KEY || ADMIN_KEY !== process.env.ADMIN_KEY) {
      console.log('Invalid admin key provided');
      return res.status(403).json({ success: false, message: 'Invalid admin key' });
    }
    
    const genreId = req.params.id;
    console.log('Attempting to delete genre ID:', genreId);
    
    const deleted = await Genre.delete(genreId);
    console.log('Genre delete result:', deleted);
    
    if (!deleted) {
      console.log('Genre not found for ID:', genreId);
      return res.status(404).json({ success: false, message: 'Genre not found' });
    }
    
    console.log('Successfully deleted genre ID:', genreId);
    return res.json({ success: true, message: 'Genre deleted successfully' });
  } catch (err) {
    console.error('Error deleting genre:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting genre',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.genre_update_get = async (req, res) => {
  try {
    const genre = await Genre.getById(req.params.id);
    if (!genre) {
      return res.status(404).send('Genre not found');
    }
    
    res.render('genres/edit', {
      title: `Edit ${genre.name}`,
      genre
    });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Server Error');
  }
};

exports.genre_update_post = async (req, res) => {
  try {
    const { name, ADMIN_KEY } = req.body;
    const genreId = req.params.id;
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).send('Invalid admin key');
    }
    
    if (!name) {
      return res.status(400).send('Name is required');
    }
    
    const updatedGenre = await Genre.update(genreId, name);
    
    if (!updatedGenre) {
      return res.status(404).send('Genre not found');
    }
    
    res.redirect(`/genres/${genreId}`);
  } catch (err) {
    console.error('Error updating genre:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};
