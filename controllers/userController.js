const { Users, Thoughts } = require('../models');

const usersController = {
    // get all users
    getUsers(req, res){
        Users.find()
            .then(async (users) => {
                const userObj = {
                    users
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err); 
            });
    },

    // get one user
    getSingleUser(req, res) {
        Users.findOne({ _id: req.params.id })
            .populate({path: 'thoughts', select: '-__v'})
            .populate({path: 'friends', select: '-__v'})
            .select('-__v')
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'No User with this ID!'});
                    return; 
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })       
    },

    // create a new user
    createUser(req, res) {
        Users.create(req.body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err)); 
    },

    // update a user by ID
    updateUser(req, res) {
        Users.findOneAndUpdate( 
            {_id: req.params.id},
            req.body,
            {new: true, runValidators: true}
        )
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No user with this ID found'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err))
    },

    // fix this

    // delete a user
    deleteUser(req, res){
        Users.findOneAndRemove({ _id: req.params.id})
            .then((user) => 
            !user
            ? res.status(404).json({ message: 'No such user exists' })
            : 
/*              Thoughts.findOneAndUpdate(
                 { username: req.params.userId },
                 { $pull: { users: req.params.userId }},
                { new: true }
            ) */
            res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err); 
        });
    },

    // add friend
    addFriend(req, res){
        Users.findOneAndUpdate({_id: req.params.id}, {$push: { friends: req.params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },


    // delete friend
    deleteFriend(req, res) {
        Users.findOneAndUpdate({_id: req.params.id}, {$pull: { friends: req.params.friendId}}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }


};

module.exports = usersController; 