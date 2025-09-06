const pool = require('../config/database');

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query('DELETE FROM game_genres');
    await client.query('DELETE FROM game_developers');
    await client.query('DELETE FROM games');
    await client.query('DELETE FROM genres');
    await client.query('DELETE FROM developers');
    
    await client.query('ALTER SEQUENCE games_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE genres_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE developers_id_seq RESTART WITH 1');
    
    const genres = [
      'Action',
      'Adventure',
      'RPG',
      'Strategy',
      'Simulation',
      'Sports',
      'Puzzle',
      'Sandbox',
      'FPS',
      'Mobile'
    ];
    
    for (const genre of genres) {
      await client.query('INSERT INTO genres (name) VALUES ($1)', [genre]);
    }
    
    const developers = [
      'Mojang Studios',
      'Activision',
      'Game Freak',
      'Nintendo',
      'Supercell',
      'Epic Games',
      'Rockstar Games',
      'Electronic Arts',
    ];
    
    for (const developer of developers) {
      await client.query('INSERT INTO developers (name) VALUES ($1)', [developer]);
    }
    
    const games = [
      {
        title: 'Minecraft',
        image_url: 'https://m.media-amazon.com/images/M/MV5BNjQzMDlkNDctYmE3Yi00ZWFiLTlmOWYtMjI4MzQ4Y2JhZjY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [2, 8],
        developers: [1]
      },
      {
        title: 'Call of Duty: Black Ops II',
        image_url: 'https://m.media-amazon.com/images/M/MV5BMjFiYjBjYmMtOGNjMS00ZWU1LWFjYjEtYjQzMWJjODYzYWM5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 9],
        developers: [2]
      },
      {
        title: 'Pokemon: Blue Version',
        image_url: 'https://m.media-amazon.com/images/M/MV5BMjFiZjhmMzAtMzQwOS00NTI3LTk2OWEtODM4NTVhMmRmZjk0XkEyXkFqcGc@._V1_.jpg',
        genres: [2, 3],
        developers: [3, 4]
      },
      {
        title: 'Clash of Clans',
        image_url: 'https://m.media-amazon.com/images/M/MV5BYWMyYzc5ZWEtOTk1ZS00NzFlLTkwNjEtZmVhMzlhNDhkMmQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [4, 10],
        developers: [5]
      },
      {
        title: 'Fortnite',
        image_url: 'https://m.media-amazon.com/images/M/MV5BMTZlMmIxM2EtN2Y4Zi00M2ZhLTk3NzgtNjJmZTU0MTQ3YjcwXkEyXkFqcGc@._V1_.jpg',
        genres: [1, 9],
        developers: [6]
      },
      {
        title: 'Call of Duty: Modern Warfare',
        image_url: 'https://m.media-amazon.com/images/M/MV5BNzczN2VmMzEtNTk4NS00OTk0LTg4MWYtZWVkYzQ0MzE2NmQ4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 9],
        developers: [2]
      },
      {
        title: 'Clash Royale',
        image_url: 'https://m.media-amazon.com/images/M/MV5BODYyYWVkODItMzVkYS00YThmLWFiNGQtYmI3ZGI4YWEzZDY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [4, 10],
        developers: [5]
      },
      {
        title: 'Grand Theft Auto V',
        image_url: 'https://m.media-amazon.com/images/M/MV5BOGI2Yjk1ZTEtZTA2Yy00ZjQ3LTk4MTgtYTgyMGQ1Zjk3YjgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 2],
        developers: [7]
      },
      {
        title: 'FIFA 18',
        image_url: 'https://m.media-amazon.com/images/M/MV5BYjdkM2UyZjItM2Q5YS00YThjLTg1NjUtNmJjNDA4NTJiZTY1XkEyXkFqcGc@._V1_QL75_UY281_CR46,0,190,281_.jpg',
        genres: [6],
        developers: [8]
      },
      {
        title: 'Brawl Stars',
        image_url: 'https://m.media-amazon.com/images/M/MV5BMzVkNDFkNjEtZDE1OC00MTJmLWIxNjQtYWM1MWQxNThiODI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 10],
        developers: [5]
      },
      {
        title: 'Grand Theft Auto: San Andreas',
        image_url: 'https://m.media-amazon.com/images/M/MV5BOTYzMzg5MGUtNzhlZS00YWMzLTkwY2EtY2I2MjVmZDUzYjYwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 2],
        developers: [7]
      },
      {
        title: 'Call of Duty: Warzone',
        image_url: 'https://m.media-amazon.com/images/M/MV5BN2EzNTg2MTMtYjA4Yi00ZmUzLWE5ZTktNDFiZGNmNjc0MTViXkEyXkFqcGc@._V1_.jpg',
        genres: [1, 9],
        developers: [2]
      },
      {
        title: 'Grand Theft Auto: Vice City',
        image_url: 'https://m.media-amazon.com/images/M/MV5BYTcwMWYzMjgtYjQwYy00ODA2LTlkMTgtMzE0Y2RlYzJlMGI5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        genres: [1, 2],
        developers: [7]
      },
      {
        title: 'Pokemon: Red Version',
        image_url: 'https://m.media-amazon.com/images/M/MV5BZjBiZThkOTMtYWU5My00ZDg2LWI1NzktN2Q3MDMwODUwOTZkXkEyXkFqcGc@._V1_.jpg',
        genres: [2, 3],
        developers: [3, 4]
      }
    ];
    
    for (const game of games) {
      const gameRes = await client.query(
        'INSERT INTO games (title, image_url) VALUES ($1, $2) RETURNING id',
        [game.title, game.image_url]
      );
      
      const gameId = gameRes.rows[0].id;
      
      for (const genreId of game.genres) {
        await client.query(
          'INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)',
          [gameId, genreId]
        );
      }
      
      for (const developerId of game.developers) {
        await client.query(
          'INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)',
          [gameId, developerId]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
