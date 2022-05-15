const S3 = require('aws-sdk/clients/s3');
const config = require('config');
const fs = require('fs');

const bucketName = config.get('AWS_BUCKET_NAME');
const region = config.get('AWS_BUCKET_REGION');
const accessKeyId = config.get('AWS_ACCESS_KEY');
const secretAccessKey = config.get('AWS_SECRET_KEY');

const s3 = new S3 ({
  region,
  accessKeyId,
  secretAccessKey
});

// Upload a file to S3
function uploadFileToS3(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    key: file.filename
  }
  return s3.upload(uploadParams).promise();
}

exports.uploadFileToS3 = uploadFileToS3;

// Download a file from S3
function getFileStreamS3(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStreamS3 = getFileStreamS3;

