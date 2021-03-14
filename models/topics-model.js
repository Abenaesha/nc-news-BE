const dbConnection = require('../db/dbConnection');

exports.fetchTopics = () => {
    // ('in the model...!');
    return dbConnection('topics').select('*');
}