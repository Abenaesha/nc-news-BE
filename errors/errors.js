exports.handle400s = (err, req, res, next) => {
  if (err.code === '22P02' || err.code === '42703') {
    res.status(400).send({
      msg: 'Bad Request!'
    });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  err ?
    res.status(err.status).send({ msg: err.msg })
    :
    next(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed!' });
};