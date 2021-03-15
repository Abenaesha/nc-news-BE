const dbConnection = require('../db/dbConnection');

exports.fetchTopics = () => {
    return dbConnection('topics').select('*');
}

exports.postTopic = (newTopic) => {
    return dbConnection('topics')
        .insert(newTopic)
        .returning('*');
}