'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

module.exports.check = (fileName) => {
    const params = {
        Image: {
            S3Object: {
                Bucket: "serverless-cat-detector-img-repo",
                Name: fileName
            }
        },
        MaxLabels: 10,
        MinConfidence: 60
    };

    return new Promise((resolve, reject) => {
        rekognition.detectLabels(params, function (err, data) {
            if (err) {
                return reject(new Error(err));
            }
            else {
                console.log(data);
                return resolve(module.exports.imageLabel(data));
            }
        });
    });
};

module.exports.imageLabel = (data) => {
    const isCat = module.exports.isCatRecognized(data);
    if (isCat) {
        return 'cat';
    } else {
        return 'other';
    }
};

module.exports.isCatRecognized = (rawLabels) => {
    const labels = rawLabels.Labels;
    return labels.some(function (label) { return label.Name == 'Cat' });
};