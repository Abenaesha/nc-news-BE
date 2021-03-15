const fs = require('fs')

exports.fetchAllRoutes = () => {
  return new Promise((res, rej) => {
    fs.readFile('./endpoints.json', 'utf8', (err, data) => {
      err ?
        rej(err)
        :
        res(data);
    })
  });
};