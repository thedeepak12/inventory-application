const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/database');
const Game = require('./models/game');
const gameController = require('./controllers/gameController');
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

app.get('/', gameController.game_list);

app.get('/games', gameController.game_list);
app.get('/games/new', gameController.game_create_get);
app.get('/games/:id', gameController.game_detail);
app.post('/games', gameController.game_create_post);

app.get('/developers', developerController.developer_list);
app.get('/developers/new', developerController.developer_create_get);
app.get('/developers/:id', developerController.developer_detail);
app.post('/developers', developerController.developer_create_post);

app.get('/genres', genreController.genre_list);
app.get('/genres/new', genreController.genre_create_get);
app.get('/genres/:id', genreController.genre_detail);
app.post('/genres', genreController.genre_create_post);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
