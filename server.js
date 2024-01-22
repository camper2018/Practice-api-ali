const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json({limit: '1mb'}));
app.use(cors());
const port = 3000;
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/nutrition/:query', async (req, res) => {
      const apiKey = process.env.API_KEY;
      const apiHost = process.env.API_HOST;
      const queryItem  = req.params.query;
      const options = {
        method: 'GET',
        headers: {'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': apiHost }
      };
      
      if (!queryItem) {
        return res.status(400).json({ error: 'Please enter food item to get nutritional info.' });
      }
      try {
        const apiUrl = `https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser?ingr=${queryItem}`;
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.json({error});
    }
  });
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});