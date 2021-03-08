// extract any functions you are using to manipulate your data, into this file
const data = require('../data/test-data/articles');

exports.amendTimeStamp = (data) => {
    const amendedInfo = data.map(({ ...info }) => {
        const unixTimeStamp = info.created_at;
        info.created_at = new Date(unixTimeStamp);
        return info;
    });
    return amendedInfo;
}