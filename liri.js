//read and sets environmental variables with .env package
require("dotenv").config();

// run keys file
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);