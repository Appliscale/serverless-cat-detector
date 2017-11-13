'use strict';

const STATUS_TABLE_NAME = 'CatDetectionStatus'

const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.imgClassification = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    const filesToBeChecked = module.exports.recordsToFiles(module.exports.filterEvents(event));

    filesToBeChecked.forEach(function (fileName) {
        putNewFileStatus(fileName);

        var params = {
            Image: {
                S3Object: {
                    Bucket: "cat-detector-img-repo",
                    Name: fileName
                }
            },
            MaxLabels: 10,
            MinConfidence: 60
        };

        rekognition.detectLabels(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    putFileErrorStatus(fileName);
                }
                else {
                    console.log(data);
                    const isCat = module.exports.isCatRecognized(data);
                    if (isCat) {
                        putCatRecognizedStatus(fileName);
                    } else {
                        putOtherFileStatus(fileName);
                    }
                }
            });
    });

    callback(null, event);

};

module.exports.filterEvents = (s3Events) => {
    const records = s3Events['Records'];
    const fileAddedEvents = records.filter(function (event) {
        return event['eventName'] == 'ObjectCreated:Put'
    });
    return fileAddedEvents;
};


module.exports.recordsToFiles = (s3Records) => {
    return s3Records.map(function (record) {
        return record['s3']['object']['key'];
    });
};

module.exports.isCatRecognized = (rawLabels) => {
    const labels = rawLabels.Labels;
    return labels.some(function (label) { return label.Name == 'Cat' });
};

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

function putNewFileStatus(fileName) {
    return putStatus(module.exports.dbItem(fileName, false, 'new'));
};

function putFileErrorStatus(fileName) {
    return putStatus(module.exports.dbItem(fileName, true, 'error'));
};

function putCatRecognizedStatus(fileName) {
    return putStatus(module.exports.dbItem(fileName, true, 'cat'));
};

function putOtherFileStatus(fileName) {
    return putStatus(module.exports.dbItem(fileName, true, 'other'));
};

function putStatus(status) {
    dynamoDb.put(status, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    });
};


