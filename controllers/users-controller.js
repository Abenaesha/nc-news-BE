const {
    fetchUsersByUsername, fetchUsers, postUser,
} = require('../models/users-model');

exports.getUsers = (req, res, next) => {
    fetchUsers().then(users => {
        res.status(200).send({ users })
    })
        .catch(err => next(err))
}

exports.addNewUser = (req, res, next) => {
    postUser(req.body).then(([newUser]) => {
        res.status(201).send({ newUser })
    })
        .catch(err => next(err))
}

exports.getUsersByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUsersByUsername(username).then((user) => {
        if (user === undefined) {
            return Promise.reject({ status: 404, msg: 'This user NOT found, TRY AGAIN!' });
        } else {
            res.status(200).send({ user });
        }
    })
        .catch(err => next(err));
}