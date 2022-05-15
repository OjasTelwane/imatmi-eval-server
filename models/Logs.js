const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Logs = new Schema(
 {
     level : {type : String},
     message : {type : String},
     meta : {type : Object}
 }
);

Logs.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('Logs', Logs);
