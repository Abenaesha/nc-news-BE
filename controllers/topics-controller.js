const { fetchTopics } = require('../models/topics-model');

exports.getTopics = (req, res, next) => {
    // ('in the controller...!')
    fetchTopics().then(topics => {
        res.status(200).send({ topics });
    })
        .catch(err => {
        next(err)
    })
}