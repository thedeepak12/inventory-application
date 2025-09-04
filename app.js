const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/database');

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

app.get('/', (req, res) => {
  res.render('layouts/main', { 
    
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
