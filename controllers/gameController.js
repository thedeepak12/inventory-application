const Game = require('../models/game');
const pool = require('../config/database');

exports.game_create_get = async (req, res) => {
  try {
    const [genresResult, developersResult] = await Promise.all([
      pool.query('SELECT id, name FROM genres ORDER BY id'),
      pool.query('SELECT id, name FROM developers ORDER BY id')
    ]);
    
    res.render('games/new', {
      genres: genresResult.rows,
      developers: developersResult.rows
    });
  } catch (err) {
    console.error('Error loading form:', err);
    res.status(500).send('Server Error');
  }
};

exports.game_create_post = async (req, res) => {
  try {
    console.log('Form data received:', req.body);
    
    const { title, image_url, genre_ids, developer_ids, ADMIN_KEY } = req.body;
    
    console.log('Extracted data:', { title, image_url, genre_ids, developer_ids });
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).send('Invalid admin key');
    }
    
    if (!title) {
      return res.status(400).send('Title is required');
    }
    
    const genreIdsArray = genre_ids 
      ? Array.isArray(genre_ids) 
        ? genre_ids.filter(id => id) 
        : [genre_ids].filter(id => id)
      : [];
      
    const developerIdsArray = developer_ids 
      ? Array.isArray(developer_ids) 
        ? developer_ids.filter(id => id) 
        : [developer_ids].filter(id => id)
      : [];
    
    console.log('Parsed IDs:', { genreIdsArray, developerIdsArray });
    
    if (genreIdsArray.length === 0 || developerIdsArray.length === 0) {
      return res.status(400).send('Please provide at least one genre ID and one developer ID');
    }
    
    const gameData = {
      title,
      image_url: image_url || null,
      genre_ids: genreIdsArray,
      developer_ids: developerIdsArray
    };
    
    console.log('Creating game with data:', gameData);
    
    const newGame = await Game.create(gameData);
    
    console.log('Game created successfully:', newGame);
    
    res.redirect(`/games/${newGame.id}`);
  } catch (err) {
    console.error('Error creating game:', err);
    console.error('Error stack:', err.stack);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};

exports.game_list = async (req, res) => {
  try {
    const games = await Game.getAll();
    res.render('games/index', { 
      title: 'All Games', 
      games 
    });
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Server Error');
  }
};

exports.game_detail = async (req, res) => {
  try {
    const game = await Game.getById(req.params.id);
    
    if (!game) {
      return res.status(404).send('Game not found');
    }
    
    res.render('games/detail', {
      title: game.title,
      game
    });
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).send('Server Error');
  }
};

exports.game_delete = async (req, res) => {
  try {
    const { ADMIN_KEY } = req.body;
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Invalid admin key' });
    }
    
    const gameId = req.params.id;
    const deleted = await Game.delete(gameId);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    return res.json({ success: true, message: 'Game deleted successfully' });
  } catch (err) {
    console.error('Error deleting game:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting game',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.game_update_get = async (req, res) => {
  try {
    const game = await Game.getById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    
    const [genresResult, developersResult] = await Promise.all([
      pool.query('SELECT id, name FROM genres ORDER BY id'),
      pool.query('SELECT id, name FROM developers ORDER BY id')
    ]);
    
    const selectedGenreIds = game.genres.map(g => g.id);
    const selectedDeveloperIds = game.developers.map(d => d.id);
    
    res.render('games/edit', {
      title: `Edit ${game.title}`,
      game,
      genres: genresResult.rows,
      developers: developersResult.rows,
      selectedGenreIds,
      selectedDeveloperIds
    });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Server Error');
  }
};

exports.game_update_post = async (req, res) => {
  try {
    const { title, image_url, genre_ids, developer_ids, ADMIN_KEY } = req.body;
    const gameId = req.params.id;
    
    console.log('Update form data received:', { title, image_url, genre_ids, developer_ids });
    
    if (ADMIN_KEY !== process.env.ADMIN_KEY) {
      return res.status(403).send('Invalid admin key');
    }
    
    if (!title) {
      return res.status(400).send('Title is required');
    }
    
    const genreIdsArray = genre_ids ? (Array.isArray(genre_ids) ? genre_ids : [genre_ids]) : [];
    const developerIdsArray = developer_ids ? (Array.isArray(developer_ids) ? developer_ids : [developer_ids]) : [];
    
    console.log('Parsed IDs for update:', { genreIdsArray, developerIdsArray });
    
    if (genreIdsArray.length === 0 || developerIdsArray.length === 0) {
      return res.status(400).send('Please provide at least one genre ID and one developer ID');
    }
    
    const gameData = {
      title,
      image_url: image_url || null,
      genre_ids: genreIdsArray,
      developer_ids: developerIdsArray
    };
    
    console.log('Updating game with data:', gameData);
    
    await Game.update(gameId, gameData);
    
    console.log('Game updated successfully');
    
    res.redirect(`/games/${gameId}`);
  } catch (err) {
    console.error('Error updating game:', err);
    console.error('Error stack:', err.stack);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};