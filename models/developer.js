const pool = require('../config/database');

const Developer = {
  create: async (name, image_url) => {
    try {
      let devName, devImageUrl;
      
      if (typeof name === 'object' && name !== null) {
        devName = name.name;
        devImageUrl = name.image_url || null;
      } else {
        devName = name;
        devImageUrl = image_url || null;
      }
      
      const trimmedName = String(devName || '').trim();
      
      if (!trimmedName) {
        throw new Error('Developer name cannot be empty');
      }
      
      const query = `
        INSERT INTO developers (name, image_url)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [trimmedName, devImageUrl];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating developer:', error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM developers ORDER BY name');
      return result.rows;
    } catch (err) {
      console.error('Error in Developer.getAll:', err);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM developers WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const developer = result.rows[0];
      
      const gamesResult = await pool.query(
        `SELECT g.* FROM games g
         JOIN game_developers gd ON g.id = gd.game_id
         WHERE gd.developer_id = $1`,
        [id]
      );
      
      developer.games = gamesResult.rows;
      
      return developer;
    } catch (err) {
      console.error(`Error in Developer.getById: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  },

  update: async (id, name) => {
    try {
      const result = await pool.query(
        'UPDATE developers SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (err) {
      console.error(`Error in Developer.update: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  },

  delete: async (id) => {
    try {
      await pool.query('BEGIN');
      
      const checkResult = await pool.query('SELECT * FROM developers WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        await pool.query('COMMIT');
        return false;
      }
      
      await pool.query('DELETE FROM game_developers WHERE developer_id = $1', [id]);
      
      await pool.query('DELETE FROM developers WHERE id = $1', [id]);
      
      await pool.query('COMMIT');
      return true;
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(`Error in Developer.delete: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Developer;