const mongoose = require('mongoose');

const Actor = require('../models/Actor');
const Movie = require('../models/Movie');

module.exports = {

    getAll: function (req, res) {
        Actor.find().populate('movies').exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },

    

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err, removedData) {
            if (err) return res.status(400).json(err);
            res.json(removedData);
        });
    },

    changeAge: function(req, res) {
        Actor.updateMany({bYear:{$lt: 1969}}, {$inc: {bYear: -4}},function(err, data){
            if (err) return res.status(400).json(err);
            if (!data) return res.status(404).json();
            res.json({msg: "Updated!!!"});
        });
    },

    delActorAndMovies: function(req, res){

        Actor.findOneAndRemove({_id: req.params.id}, function(err, removedData){

            if (err) return res.status(400).json(err);
            if (!removedData) return res.status(404).json();
            for (i in removedData.movies){
                Movie.findOneAndRemove({_id: removedData.movies[i]}, function(err, removedMovie){

                    if (err) return res.status(400).json(err);
                    if (!removedMovie) return res.status(404).json();
                })
            }
            res.json({msg: "Actor and All his movies removed!!"});
        })
    },


    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    },

    deleteOneAndAllMovies: function(req, res) {
        Actor.findOne({_id: req.params.id}, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();


        });
    },

    removeMovie: function(req, res) {
        Actor.findOne({ _id: req.params.actorid }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            let index = actor.movies.indexOf(req.params.movieid);
            if (index > -1) {
                actor.movies.splice(index, 1);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            }
            else res.json("movie not found!!!");
        });
    }
};