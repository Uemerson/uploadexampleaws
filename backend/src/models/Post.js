const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
  }
});

module.exports = mongoose.model("Post", PostSchema);