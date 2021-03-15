const { fetchTopics, postTopic } = require('../models/topics-model');

exports.getTopics = (req, res, next) => {
    fetchTopics().then(topics => {
        res.status(200).send({ topics });
    })
        .catch(err => {
            console.log(err)
        next(err)
    })
}

exports.addNewTopic = (req, res, next) => {
    postTopic(req.body).then(([newTopic]) => {
        res.status(201).send({ newTopic })
    })
        .catch(err => next(err));
}