CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_date DATE
);

CREATE TABLE game_genres (
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE game_developers (
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  developer_id INTEGER REFERENCES developers(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, developer_id)
);
