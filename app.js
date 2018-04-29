const yargs = require('yargs');
const axios = require('axios');
require('dotenv').config();

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAP_API_KEY}`;

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS' || response.data.status === 'INVALID_REQUEST') {
    throw new Error('Unable to find that address');
  }

  let latitude = response.data.results[0].geometry.location.lat;
  let longitude = response.data.results[0].geometry.location.lng;
  console.log('address: ', response.data.results[0].formatted_address);
  const weatherUrl = `https://api.darksky.net/forecast/${process.env.DARK_SKIES_API_KEY}/${latitude},${longitude}`;

  return axios.get(weatherUrl);
}).then((res) => {
  let temperature = res.data.currently.temperature;
  let apparentTemperature = res.data.currently.apparentTemperature;
  console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to server');
  } else {
    console.log(e.message)
  }
});
