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

// Api to get nutrition of the queried food item
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
// fetches cat images from catapi
app.get("/catapi/:limit",  async (req, res) => {
    const key = process.env.CAT_API_KEY;
    const limit = req.params.limit;
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${key}`);
    if (!response.ok){
        throw new Error('Failed to fetch data: HTTP error!', response.status);
    }
    const data = await response.json();
    res.json(data);
})

/***********   Promise.all Practice  ********************/
// fetches cat and dog images from catapi and dogapi 
app.get("/catdogapi/:limit", async (req, res) => {
    const key = process.env.CAT_API_KEY;
    const limit = req.params.limit;
    const response1 = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${key}`);
    const response2 = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${limit}&api_key=${key}`);
    Promise.all([response1.json(), response2.json()])
    .then(data => res.json(data))
    .catch(error => console.error(error))
    
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});