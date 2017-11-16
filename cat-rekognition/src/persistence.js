'use strict';

const STATUS_TABLE_NAME = 'ServerlessCatDetectorStatus';

const AWS = require('aws-sdk');
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

module.exports.getStatus = (fileName) => {
    const params = {
        TableName: STATUS_TABLE_NAME,
        Key: {
            "name": fileName
        },
        AttributesToGet: ["checked", "status"]
    };

    return new Promise((resolve, reject) => {
        dynamoDb.get(params, function (err, data) {
            if (err) {
                return reject(new Error(err));
            } else {
                console.log(data);
                return resolve(data.Item);
            }
        });
    });
}