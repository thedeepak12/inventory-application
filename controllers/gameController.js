const Game = require('../models/game');
const pool = require('../config/database');

exports.game_create_get = (req, res) => {
  res.render('games/new');
};

exports.game_create_post = async (req, res) => {
  try {    
    return res.status(403).send('Invalid admin key');
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).send('Server Error');
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
    console.error('Error fetching game details:', err);
    res.status(500).send('Server Error');
  }
};