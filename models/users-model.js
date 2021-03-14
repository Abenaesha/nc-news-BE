const dbConnection = require('../db/dbConnection');

exports.fetchUsersByUsername = (username) => {
    return dbConnection('users')
        .where({ username })
        .then(user => {
        return user[0];
    });
}