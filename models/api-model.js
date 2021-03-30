const fs = require("fs");
const test = require("../endpoints.json");

exports.fetchAllEndpoints = () => {
  return new Promise((res, rej) => {
    fs.readFile("endpoints.json", "utf8", (err, data) => {
      err ? rej(err) 
      : res(JSON.parse(data))
    });
  });
};