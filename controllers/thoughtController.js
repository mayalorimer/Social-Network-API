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
    getSingleThought(req, res) {
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


    //create a thought
    createThought(req, res){
        Thoughts.create(req.body)
        .then(({_id}) => {
            return Users.findOneAndUpdate({ _id: req.params.userId},
                {$push: {thoughts: _id}}, 
                {new: true});
        })
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({message: 'Error'});
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch(err => res.json(err));
    },

    // update a thought by ID
    updateThought(req, res){
        Thoughts.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
                res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    // delete a thought
    deleteThought(req, res){
        Thoughts.findOneAndDelete({_id: req.params.id})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },


    // add a reaction


    // delete a reaction


};



module.exports = thoughtsController; 