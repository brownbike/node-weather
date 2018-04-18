const request = require('request');
require('dotenv').config();

const geocodeAddress = (address, callback) => {
  const encodedAddress = encodeURIComponent(address);

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAP_API_KEY}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Cannot connect to google servers.');
    } else if (body.status === 'ZERO_RESULTS' || body.status === 'INVALID_REQUEST') {
      callback('Unable to find that address');
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      })
    }
  });
};

module.exports.geocodeAddress = geocodeAddress;
