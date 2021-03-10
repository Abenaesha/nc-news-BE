const { fetchTopics } = require('../models/topics-model');

exports.getTopics = (req, res, next) => {
    //console.log('in the controller...!')
    fetchTopics().then(topics => {
        res.status(200).send({ topics });
    })
        .catch(err => {
        next(err)
    })
}