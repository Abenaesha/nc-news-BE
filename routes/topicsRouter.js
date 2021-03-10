const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-controller');
const { handle405s } = require('../errors/errors');

topicsRouter
    .route('/')
    .get(getTopics)
    .post(handle405s);

module.exports = topicsRouter;
