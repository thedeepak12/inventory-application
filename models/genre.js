const pool = require('../config/database');

const Genre = {
  create: async (genreData) => {
    const { name } = genreData;
    const query = `
      INSERT INTO genres (name)
      VALUES ($1)
      RETURNING *
    `;
    const values = [name];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating genre:', error);
      throw error;
    }
  },
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
      const genreName = typeof name === 'object' ? name.name : name;
      const trimmedName = genreName.trim();
      
      if (!trimmedName) {
        throw new Error('Genre name cannot be empty');
      }
      
      const result = await pool.query(
        'INSERT INTO genres (name) VALUES ($1) RETURNING *',
        [trimmedName]
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
      await pool.query('BEGIN');
      
      const checkResult = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        await pool.query('COMMIT');
        return false;
      }
      
      await pool.query('DELETE FROM game_genres WHERE genre_id = $1', [id]);
      
      await pool.query('DELETE FROM genres WHERE id = $1', [id]);
      
      await pool.query('COMMIT');
      return true;
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(`Error in Genre.delete: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Genre;
