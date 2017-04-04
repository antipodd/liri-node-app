//grab twitter keys and store in variable keys
var keys = require("./keys.js");

//require Twitter package
var Twitter = require('twitter');

//require Spotify package
var spotify = require('spotify');

//require OMDB package
var omdbApi = require('omdb-client');

//require file system
var fs = require("fs"); 

//Twitter authentication
var client = new Twitter(keys.twitterKeys);

//process arguments
var instruction = process.argv[2];
var input = process.argv[3];

switch(instruction) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        if (input) {
            spotifyThisSong(input, process.argv[4]);
        } else {
            spotifyThisSong("The Sign", "Ace of Base");
        }
        break;
    case "movie-this":
        if (input) {
            movieThis(input);
        } else {
            movieThis('Mr Nobody');
        }
        break;
    case "do-what-it-says":
        doWhatItSays();
    /*default:
        console.log("Tell me what to do");*/ //this seems to fire in the case of do-what-it-says
}

//do-what-it-says
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        //console.log(data);
        var dataArray = data.split(",");
        //console.log(dataArray);
        appendToLogFile("do-what-it-says \n");
        if (dataArray[0] === "spotify-this-song") {
            spotifyThisSong(dataArray[1], "Backstreet Boys"); 
        }   
    });
}
//get song information from Spotify (included optional artist argument)
function spotifyThisSong (song, artist) {
    if (!artist) {
        var artist = "";
    }
    spotify.search({ type: 'track', query: 'track:' + song + ' artist:' + artist, limit: 1 }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        var artistName = data.tracks.items[0].artists[0].name;
        var songName = data.tracks.items[0].name;
        var externalLink = data.tracks.items[0].external_urls.spotify;
        var albumName = data.tracks.items[0].album.name
        //console.log(JSON.stringify(data.tracks.items[0], null, 2)); 
        //print to console
        console.log("Artist: " + artistName);
        console.log("Song: " + songName);
        console.log("Link: " + externalLink);
        console.log("Album: " + albumName);
        
        //Add to log.txt
        appendToLogFile("spotify-this-song: " + song + "\nArtist: " + artistName + "\n" + "Song: " + songName + "\n" + "Link: " + externalLink + "\n" + "Album: " + albumName + "\n\n");
    });
}
//get movie information from OMDB 
function movieThis (movieName) {
    var params = {
    title: movieName,
    incTomatoes: true
    }

    omdbApi.get(params, function(err, data) {
        if(err) {
            return console.error(err);
        }
     
        if(!data) {
            return console.log('Movie not found!');
        }
        //console.log(JSON.stringify(data, null, 2));
        //print to console
        console.log("Title: " + data.Title);
        console.log("");
        console.log("Released: " + data.Released);
        console.log("");
        console.log("IMDB Rating: " + data.Ratings[0].Value);
        console.log("");
        console.log("Country: " + data.Country);
        console.log("");
        console.log("Language: " + data.Language);
        console.log("");
        console.log("Plot: " + data.Plot);
        console.log("");
        console.log("Actors: " + data.Actors);
        console.log("");
        console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
        console.log("");
        console.log("Rotten Tomatoes URL: " + data.tomatoURL);
        console.log("-------------------------------------------------------------------");
        //append to log.txt
        //is there a cleaner way than this?
        appendToLogFile("movie-this: " + movieName + "\nTitle: " + data.Title + "\n" + "Released: " + data.Released + "\n" + "IMDB Rating: " + data.Ratings[0].Value + "\n" + "Country: " + data.Country + "\n" + "Language: " + data.Language + "\n" + "Plot: " + data.Plot + "\n" + "Actors: " + data.Actors + "\n" + "Rotten Tomatoes Rating: " + data.Ratings[1].Value + "\n" + "Rotten Tomatoes URL: " + data.tomatoURL + "\n\n");
    });
}
//get latest 20 tweets from @antipodding
function getTweets () {
    var params = {
    screen_name: 'antipodding',
    count: 20
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        //console.log(JSON.stringify(tweets, null, 2));
        //console.log(tweets[0].created_at);
        //console.log(tweets[0].text);
        appendToLogFile("my-tweets \n")
        for (var i = 0; i < tweets.length; i++) {
            //print to console
            console.log("");
            console.log("Tweet " + (i+1) + ": ");
            console.log(tweets[i].text);
            console.log("");
            console.log("Created at: " + tweets[i].created_at);
            console.log("");
            console.log("-------------------------------------------------------------------");
            //append to log.txt
            appendToLogFile("Tweet " + (i+1) + ": \n" + tweets[i].text + "\n" + "Created at: " + tweets[i].created_at + "\n\n")   
        }
      }
    });
}

function appendToLogFile(text) {
    fs.appendFile("log.txt", text, function(error) {
        if(error) {
            console.log(error);
        } else {
            console.log("content added!");
        }   
    });
}