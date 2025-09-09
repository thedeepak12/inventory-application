const pool = require('../config/database');

const Developer = {
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

  create: async (name) => {
    try {
      const result = await pool.query(
        'INSERT INTO developers (name) VALUES ($1) RETURNING *',
        [name]
      );
      return result.rows[0];
    } catch (err) {
      console.error(`Error in Developer.create: ${err.message}`);
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
      const checkResult = await pool.query('SELECT * FROM developers WHERE id = $1', [id]);
      
      if (checkResult.rows.length === 0) {
        return false;
      }
      
      await pool.query('DELETE FROM developers WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error(`Error in Developer.delete: ${err.message}`);
      throw new Error(`Error: ${err.message}`);
    }
  }
};

module.exports = Developer;