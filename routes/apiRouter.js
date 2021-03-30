const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter')
const commentsRouter = require('./commentsRouter');
const {getAllEndpoints} = require('../controllers/api-controller')
const { handle405s } = require('../errors/errors');

apiRouter
  .route('/')
  .get(getAllEndpoints)
  .all(handle405s);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;