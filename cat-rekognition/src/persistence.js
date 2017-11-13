'use strict';

const STATUS_TABLE_NAME = 'ServerlessCatDetectorStatus'

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