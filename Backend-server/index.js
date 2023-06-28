const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const logger = require('morgan');
const Weather = require('./models/Weather');

dotenv.config();

const app = express();

const { MONGODB_URI, PORT } = process.env;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('Connected to MongoDB'))
  .catch(e => console.error('Error connecting to MongoDB:', e));


// API endpoint for receiving data
app.get('/api/display-data', async (req, res) => {
    try {
      // Retrieve all data from MongoDB
      const data = await Weather.find();

      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).json({ error: e.message });
    }
});


// API endpoint for receiving data
app.get('/api/data', async (req, res) => {
  const { temperature, humidity } = req.query;
  console.log('Received data - Temperature:', temperature, '°C, Humidity:', humidity, '%');

  try {
    await Weather.create({ temperature: parseFloat(temperature), humidity: parseFloat(humidity)  });

    return res.status(200).json({ stauts: 'saved successfully' }); 
  } catch (e) {
    return res.status(200).json({ error: e.message });
  }
});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
