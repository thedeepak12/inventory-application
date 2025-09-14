const pool = require('../config/database');

const Game = {
  create: async (gameData) => {
    const { title, image_url, genre_ids, developer_ids } = gameData;
    
    try {
      await pool.query('BEGIN');
      
      const gameQuery = `
        INSERT INTO games (title, image_url)
        VALUES ($1, $2)
        RETURNING *
      `;
      const gameResult = await pool.query(gameQuery, [title, image_url]);
      const game = gameResult.rows[0];
      
      if (genre_ids && genre_ids.length > 0) {
        for (const genreId of genre_ids) {
          if (genreId && genreId.trim()) {
            await pool.query(
              'INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)',
              [game.id, parseInt(genreId.trim())]
            );
          }
        }
      }
      
      if (developer_ids && developer_ids.length > 0) {
        for (const developerId of developer_ids) {
          if (developerId && developerId.trim()) {
            await pool.query(
              'INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)',
              [game.id, parseInt(developerId.trim())]
            );
          }
        }
      }
      
      await pool.query('COMMIT');
      
      return game;
    } catch (error) {
      await pool.query('ROLLBACK');
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
  },
  
  update: async (id, gameData) => {
    const { title, image_url, genre_ids, developer_ids } = gameData;
    
    try {
      await pool.query('BEGIN');
      
      const gameQuery = `
        UPDATE games 
        SET title = $1, image_url = $2
        WHERE id = $3
        RETURNING *
      `;
      const gameResult = await pool.query(gameQuery, [title, image_url, id]);
      const game = gameResult.rows[0];
      
      await pool.query('DELETE FROM game_genres WHERE game_id = $1', [id]);
      await pool.query('DELETE FROM game_developers WHERE game_id = $1', [id]);
      
      if (genre_ids && genre_ids.length > 0) {
        for (const genreId of genre_ids) {
          if (genreId && genreId.trim()) {
            await pool.query(
              'INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)',
              [id, parseInt(genreId.trim())]
            );
          }
        }
      }
      
      if (developer_ids && developer_ids.length > 0) {
        for (const developerId of developer_ids) {
          if (developerId && developerId.trim()) {
            await pool.query(
              'INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)',
              [id, parseInt(developerId.trim())]
            );
          }
        }
      }
      
      await pool.query('COMMIT');
      return game;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error updating game:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await pool.query('BEGIN');
      
      await pool.query('DELETE FROM game_genres WHERE game_id = $1', [id]);
      await pool.query('DELETE FROM game_developers WHERE game_id = $1', [id]);
      
      const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
      
      await pool.query('COMMIT');
      
      if (result.rowCount === 0) {
        return false;
      }
      
      return true;
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(`Error in Game.delete: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Game;
