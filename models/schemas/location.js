const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  history: [
    {
      lat: Number,
      lng: Number,
      date: Date,
    },
  ],
});

LocationSchema.methods.setLocation = function ({ lat, lng } = {}) {
  this.lat = lat;
  this.lng = lng;
  this.history.push({
    lat,
    lng,
    date: new Date(),
  });
};

module.exports = LocationSchema;
