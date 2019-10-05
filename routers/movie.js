var Actor = require('../models/Actor');
var Movie = require('../models/Movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err, removedData) {
            if (err) return res.status(400).json(err);
            res.json(removedData);
        });
    },

    delBefore: function (req, res){
        Movie.deleteMany({year: { $lt: req.params.year} }, function (err, removedData) {
            if (err) return res.status(400).json(err);
            res.json(removedData);
        })
    },


    removeActor: function(req, res) {
        Movie.findOne({ _id: req.params.movieid }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            let index = movie.actors.indexOf(req.params.actorid);
            if (index > -1) {
                movie.actors.splice(index, 1);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            }
            else res.json("actor not found!!!");
        });
    },
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            
            console.log(req.body._id);
            Actor.findOne({ _id: req.body._id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

    between: function(req, res) {
        Movie.find().where('year').gte(parseInt(req.params.year2)).lte(parseInt(req.params.year1)).exec(function(err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json(); 
            res.json(movie)
        });
    }
};