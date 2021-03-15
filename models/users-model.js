const dbConnection = require('../db/dbConnection');

exports.fetchUsers = () => {
    return dbConnection('users').select('*');
}

exports.postUser = (newUser) => {
    return dbConnection('users')
        .insert(newUser)
        .returning('*')
}

exports.fetchUsersByUsername = (username) => {
    return dbConnection('users')
        .where({ username })
        .then(user => {
        return user[0];
    });
}