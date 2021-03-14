const { fetchUsersByUsername } = require('../models/users-model');

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