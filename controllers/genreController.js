const Genre = require('../models/genre');

exports.genre_list = async (req, res) => {
  try {
    const genres = await Genre.getAll();
    res.render('genres/index', { 
      title: 'All Genres', 
      genres 
    });
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).send('Server Error');
  }
};

exports.genre_detail = async (req, res) => {
  try {
    const genre = await Genre.getById(req.params.id);
    if (!genre) {
      return res.status(404).send('Genre not found');
    }
    res.render('genres/detail', { 
      title: genre.name, 
      genre 
    });
  } catch (err) {
    console.error('Error fetching genre details:', err);
    res.status(500).send('Server Error');
  }
};
