const topicsRouter = require('express').Router();
const {
    getTopics,
    addNewTopic
} = require('../controllers/topics-controller');
const { handle400s } = require('../errors/errors');

topicsRouter
    .route('/')
    .get(getTopics)
    .post(addNewTopic);

module.exports = topicsRouter;
