const mongoose = require('mongoose');
const aws = require("aws-sdk");
const fs = require('fs');
const path = require('path');

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre('save', function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

PostSchema.pre('remove', function () {
  if (process.env.STORAGE_TYPE === 'local') {
    return fs.unlink(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key), (err) => {
      if (err) {
        console.log("Failed to delete local file:" + err);
      } else {
        console.log('Successfully deleted local file');
      }
    });
  } else if (process.env.STORAGE_TYPE === 's3') {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  }
});

module.exports = mongoose.model("Post", PostSchema);