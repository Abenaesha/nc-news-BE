 
const { fetchAllRoutes } = require('../models/api-model');

exports.getRoutes = (req, res, next) => {
  fetchAllRoutes().then((routes) => {
    res.status(200).send(routes);
  });
};