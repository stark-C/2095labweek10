const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routers/actor');
const movies = require('./routers/movie');
const path = require('path')

const app = express();

app.listen(8080);

app.use("/", express.static(path.join(__dirname, "dist/week10")))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true }, { useUnifiedTopology: true },  function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});


app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne)
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
// app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
// app.delete('/actors/:id/allMovies', actors.delActorAndMovies); //delete an actor and all movies of this actor
// app.get('/actors/:actorid/:movieid', actors.removeMovie);//remove movie from the list of movies of an actor
// app.put('/actors/updateAge', actors.changeAge)


app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
// app.get('/movies/:id', movies.getOne);
// app.put('/movies/:id', movies.updateOne);
app.delete('/movies/:id', movies.deleteOne); //delete movie by id
app.delete('/movies/del/:year', movies.delBefore);
// app.put('/movies/:movieid/:actorid', movies.removeActor); //remove actor from the list of actors of a movie
app.post('/movies/actors/:id', movies.addActor); // add existing actor the the actor list of a movie.
// app.get('/movies/:year1/:year2', movies.between)