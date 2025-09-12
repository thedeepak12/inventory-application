const pool = require('../config/database');

const Game = {
  create: async (gameData) => {
    const { title, image_url, genre_id, developer_id } = gameData;
    const query = `
      INSERT INTO games (title, image_url, genre_id, developer_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [title, image_url, genre_id, developer_id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      const gamesRes = await pool.query('SELECT * FROM games');
      const games = gamesRes.rows;
      
      if (games.length === 0) {
        console.log('No games found in database');
        return [];
      }
      
      for (const game of games) {
        game.developers = [];
        game.genres = [];
        
        try {
          const developersRes = await pool.query(
            `SELECT d.* FROM developers d
             JOIN game_developers gd ON d.id = gd.developer_id
             WHERE gd.game_id = $1`,
            [game.id]
          );
          
          if (developersRes.rows.length > 0) {
            game.developers = developersRes.rows;
          } else {
            game.developers = [{ id: 0, name: 'Unknown Developer' }];
          }
          
          game.developer_name = game.developers.map(dev => dev.name).join(', ');
          
          const genresRes = await pool.query(
            `SELECT g.* FROM genres g
             JOIN game_genres gg ON g.id = gg.genre_id
             WHERE gg.game_id = $1`,
            [game.id]
          );
          
          if (genresRes.rows.length > 0) {
            game.genres = genresRes.rows;
          } else {
            game.genres = [{ id: 0, name: 'Unknown Genre' }];
          }
          
          game.genre_name = game.genres.map(genre => genre.name).join(', ');
        } catch (err) {
          console.error(`Error fetching data for game ${game.id}:`, err);
          game.developers = [{ id: 0, name: 'Unknown Developer' }];
          game.developer_name = 'Unknown Developer';
          game.genres = [{ id: 0, name: 'Unknown Genre' }];
          game.genre_name = 'Unknown Genre';
        }
      }
      
      return games;
    } catch (err) {
      console.error('Error in getAll method:', err);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const gameRes = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
      
      if (gameRes.rows.length === 0) {
        return null;
      }
      
      const game = gameRes.rows[0];
      
      const genresRes = await pool.query(
        `SELECT g.* FROM genres g
         JOIN game_genres gg ON g.id = gg.genre_id
         WHERE gg.game_id = $1`,
        [id]
      );
      
      const developersRes = await pool.query(
        `SELECT d.* FROM developers d
         JOIN game_developers gd ON d.id = gd.developer_id
         WHERE gd.game_id = $1`,
        [id]
      );
      
      game.genres = genresRes.rows;
      game.developers = developersRes.rows;
      
      return game;
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Game;
