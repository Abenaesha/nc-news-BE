const dbConnection = require('../db/dbConnection');

exports.fetchUsersByUsername = (username) => {
    return dbConnection('users').where('username', username).then(user => {
        return user[0];
    });
}