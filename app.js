const express = require('express');
const apiRouter = require('./routes/apiRouter');
const { handleCustomErrors, handle400s } = require('./errors/errors');

const app = express();
app.use(express.json())

app.use('/api', apiRouter);
app.use(handle400s);
app.use(handleCustomErrors);



module.exports = app;