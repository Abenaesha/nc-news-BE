// extract any functions you are using to manipulate your data, into this file
const data = require("../data/development-data/articles");
const commentsInfo = require("../data/development-data/comments");

exports.amendTimeStamp = (data) => {
  const amendedInfo = data.map(({ ...info }) => {
    const unixTimeStamp = info.created_at;
    info.created_at = new Date(unixTimeStamp);
    return info;
  });
  return amendedInfo;
};

exports.ammendCommentsFormat = (data, keyToChange, newKey) => {
  const amendedInfo = data.map(({ ...info }) => {
    console.log("FUCK");
  });
  return amendedInfo;

  //remove belongs to
  //amend timestamp
  // change created by to author
  // has an article id
};
