const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('layouts/main', { 
    
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
