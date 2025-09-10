const pool = require('../config/database');

const Genre = {
  getAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM genres ORDER BY name');
      return result.rows;
    } catch (err) {
      console.error('Error in Genre.getAll:', err);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const genre = result.rows[0];
      
      const gamesResult = await pool.query(
        `SELECT g.* FROM games g
         JOIN game_genres gg ON g.id = gg.game_id
         WHERE gg.genre_id = $1`,
        [id]
      );
      
      genre.games = gamesResult.rows;
      
      return genre;
    } catch (err) {
      console.error(`Error in Genre.getById: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  },

  create: async (name) => {
    try {
      const result = await pool.query(
        'INSERT INTO genres (name) VALUES ($1) RETURNING *',
        [name]
      );
      return result.rows[0];
    } catch (err) {
      console.error(`Error in Genre.create: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  },

  update: async (id, name) => {
    try {
      const result = await pool.query(
        'UPDATE genres SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
      return result.rows[0];
    } catch (err) {
      console.error(`Error in Genre.update: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  },

  delete: async (id) => {
    try {
      await pool.query('DELETE FROM genres WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error(`Error in Genre.delete: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Genre;
