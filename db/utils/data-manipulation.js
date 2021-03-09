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

exports.createRefObject = (arr, refKey, refValue) => {
  const refObject = {};

  arr.forEach((element) => {
    const refKeys = element[refKey];
    const refVal = element[refValue];

    refObject[refKeys] = refVal;
  });

  return refObject;
};

exports.reformatData = (
  arr,
  keyToChangeOne,
  newKeyOne,
  keyToChangeTwo,
  newKeyTwo,
  refObjPair
) => {
  //console.log(arr);
  const reformattedArr = arr.map(({ ...obj }) => {
    obj[newKeyOne] = obj[keyToChangeOne];
    obj[newKeyTwo] = refObjPair[obj[keyToChangeTwo]];
    delete obj[keyToChangeOne];
    delete obj[keyToChangeTwo];
    return obj;
  });

  return reformattedArr;
};
