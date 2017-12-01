'use strict';

const STATUS_TABLE_NAME = 'ServerlessCatDetectorStatus';

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.dbItem = (fileName, scanned, scanningStatus) => {
    return {
        TableName: STATUS_TABLE_NAME,
        Item: {
            'name': fileName,
            'checked': scanned,
            'status': scanningStatus
        }
    };
};

module.exports.putStatus = (fileName, scanned, scanningStatus) => {
    const statusItem = module.exports.dbItem(fileName, scanned, scanningStatus);

    dynamoDb.put(statusItem, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    });
};

module.exports.getStatusOfAll = () => {
    const params = {
        TableName: STATUS_TABLE_NAME,
        AttributesToGet: ["name", "checked", "status"]
    };

    return new Promise((resolve, reject) => {
        dynamoDb.scan(params, function (err, data) {
            if (err) {
                return reject(new Error(err));
            } else {
                console.log(data);
                return resolve(data.Items);
            }
        });
    });
}