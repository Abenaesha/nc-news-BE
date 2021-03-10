const dbConnection = require('../db/dbConnection');

exports.fetchTopics = () => {
    //console.log('in the model...!');
    return dbConnection('topics').select('*');
}