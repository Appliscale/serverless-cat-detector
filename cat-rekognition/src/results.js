'use strict';

const persistence = require('./persistence');
const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*' };

module.exports.getClassification = (event, context, callback) => {
  console.log(event);
  if (typeof event["queryStringParameters"]["name"] === undefined || !event["queryStringParameters"]["name"]) {
    return400('Missing "name" parameter');
    return;
  }
  const name = event["queryStringParameters"]["name"];
  var imageChecked = "pending";
  var imageStatus = "(nothing detected)";

  persistence.getStatus(name).then((Item) => {
    if (Item.checked === true) {
      imageChecked = "checked";
    }
    imageStatus = Item.status;

    const response = {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        "id": name,
        "imageUrl": "https://s3-eu-west-1.amazonaws.com/serverless-cat-detector-img-repo/" + name,
        "status": imageChecked,
        "result": imageStatus
      })
    };

    callback(null, response);
  })
    .catch((error) => {
      return400("invalid name param", callback);
    });
};

var return400 = (message, callback) => {
  const response = {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ reason: message })
  }
  callback(null, response);
}
