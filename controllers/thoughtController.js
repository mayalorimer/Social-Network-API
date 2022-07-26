const { Thoughts, Users } = require('../models');

const thoughtsController = {

    // get all thoughts
    getThoughts(req, res) {
        Thoughts.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // get thought by ID
    getThoughtById(req, res) {
        Thoughts.findOne({ _id: req.params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },




};



module.exports = thoughtsController; 