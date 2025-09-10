const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/database');
const Game = require('./models/game');
const developerController = require('./controllers/developerController');
const genreController = require('./controllers/genreController');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

pool.connect()
  .then(client => {
    console.log('DB Connected');
    client.release();
  })
  .catch(err => console.error('DB Connection Error:', err.stack));

require('dotenv').config();

app.get('/', async (req, res) => {
  try {
    const games = await Game.getAll();    
    res.render('games/index', { title: 'Inventory Application', games });
  } catch (err) {
    console.error('Error in homepage route:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/developers', developerController.developer_list);
app.get('/developers/:id', developerController.developer_detail);

app.get('/genres', genreController.genre_list);
app.get('/genres/:id', genreController.genre_detail);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
