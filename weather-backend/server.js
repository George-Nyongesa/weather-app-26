require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/weather', async (req, res) => { 
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: 'City or coordinates are required' });
  }

  try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: city
            ? { q: city, appid: process.env.OPEN_WEATHER_API_KEY, units: 'metric' }
            : { lat, lon, appid: process.env.OPEN_WEATHER_API_KEY, units: 'metric' },
      });

      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'City not found' });
  }
});
app.get('/', (req, res) => {
  res.send('Weather API is running 🌤️');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});