'use strict';

const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

module.exports.imgClassification = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    const filesToBeChecked = this.recordsToFiles(this.filterEvents(event));

    filesToBeChecked.forEach(function (fileName) {
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
            if (err) console.log(err, err.stack);
            else     console.log(data);
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

