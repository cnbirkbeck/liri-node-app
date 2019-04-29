//Dependencies

//Read and sets environmental variables with .env package
require("dotenv").config();

//Import the node Spotify API NPM package
var Spotify = require("node-spotify-api");

//Import the API keys
var keys = require("./keys.js");

//Import the Axios NPM package
var axios = require ("axios");

//Import the Moment NPM package
var moment = require("moment");

//Import the FS package for reading/ writing files
var fs = require("fs");

//Initialize Spotify API client with client id and secret
var spotify = new Spotify(keys.spotify);

//FUNCTIONS

//Function that gets artist's name
var getArtistName = function(artist) {
    return artist.name;
};

//Function to get concert information
var getBands = function(artist){
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(response) {
            var jsonData = response.data;

            if(!jsonData.length){
                console.log("No results found for " + artist);
                return;
            }

            console.log ("Upcoming concerts for " + artist + ": ");

            for (var i=0; i<jsonData.length; i++) {
                var show = jsonData[i];
                
                //console log data for the concerts, if there isn't a region available display the country.
                console.log(
                    show.venue.city + 
                    ","+
                    (show.venue.region || show.venue.country) + 
                    " at " + 
                    show.venue.name + 
                    " " + 
                    // use moment.js to format the date to month, day, year
                    moment(show.datetime).format("MM/DD/YYYY")
                );

            }
        }
    );
};

//Function that runs Spotify search
var getSpotify = function(songName){
    if (songName === undefined){
        songName = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: songName
        },
        function(err, data) {
            if (err) { 
                console.log ("An error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for(var i=0; i< songs.length; i++) {
                console.log(i);
                console.log("Artist(s): " + songs[i].artists.map(getArtistName));
                console.log("Song Name: " + songs[i].name);
                console.log("Preview Song: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log(" \n--------------------------------------\n");              
            }
        }
    );
};

// Function for running the movie search with OMD API
var getFilm = function(movieName) {
    if(movieName === undefined) {
        movieName = "Mr. Nobody";
    }

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    axios.get(url).then(
        function(response) {
            var jsonData = response.data;

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            console.log("Country Produced: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
        }
    );
};

//Function for do what it says text on file
var doWhatItSays = function(){
    fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);

        var dataArr = data.split(", ");

        if(dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        }else if (dataArr.length === 1) { 
            pick(dataArr[0]);
        }
    });
};

//Switch statement for determining which command to execute

var choice = function(caseData, functionData){
    switch (caseData){
    case "concert-this":
        getBands(functionData);
        break;
    case "spotify-this-song":
        getSpotify(functionData);
        break;
    case "movie-this":
        getFilm(functionData);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Sorry, LIRI doesn't understand.");
     
    }
};

