# liri-node-app

For movie-this and spotify-this-song commands, I'm expecting input within quotes for multiword songs, artists, and movies, e.g. 

node liri.js movie-this "Rogue One"

node liri.js spotify-this-song "turn down for what" "DJ Snake"

the command

node liri.js spotify-this-song "turn down for what"

does not return a song, in this case the artist must be specified

The artist is an optional argument and it was included so that the default spotify-this-song call returned "The Sign" by "Ace of Base" and not another song of the same name by another artist.