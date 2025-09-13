const Genre = require('../models/genre');
const pool = require('../config/database');

exports.genre_create_get = (req, res) => {
  res.render('genres/new');
};

exports.genre_create_post = async (req, res) => {
  try {
    let genreData;
    
    if (req.headers['content-type'] === 'application/json') {
      genreData = req.body;
    } else {
      const { name, ADMIN_KEY } = req.body;
      
      if (ADMIN_KEY !== process.env.ADMIN_KEY) {
        return res.status(403).send('Invalid admin key');
      }
      
      if (!name) {
        return res.status(400).send('Name is required');
      }
      
      genreData = { name };
    }
    
    const newGenre = await Genre.create(genreData);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json(newGenre);
    } else {
      res.redirect(`/genres/${newGenre.id}`);
    }
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
      title: genre.name, 
      genre 
    });
  } catch (err) {
    console.error('Error fetching genre details:', err);
    res.status(500).send('Server Error');
  }
};
