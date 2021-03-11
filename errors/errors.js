//regular error function
exports.handle405s = (req, res, next) => {
    res.status(405).send({ msg: 'Method Not Allowed!' });
}

exports.handle400s = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({
      msg: 'The article ID you inputted is INVALID!'
    });
  } else next(err);
}

exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: 'The path you are trying to reach not found' });
}

exports.handleCustomErrors = (err, req, res, next) => {
  err ?
      res.status(err.status).send({ msg: err.msg })
      :
      next(err);
}
  