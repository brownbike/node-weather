const request = require('request');
require('dotenv').config();

const getWeather = (latitude, longitude, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${process.env.DARK_SKIES_API_KEY}/${latitude},${longitude}`,
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    } else {
      callback('Unable to fetch weather')
    }
  });
}

module.exports.getWeather = getWeather;
