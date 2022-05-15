 const mongoose = require('mongoose');
 const mongoosePaginate = require('mongoose-paginate-v2');
 const Schema = mongoose.Schema;
 
 const bigFiveTestTemplates = new mongoose.Schema(
   {
     testName: { type: String },
     testDescription: { type: String },
     testDuration: { type: Number },
     testType: { type: String },
     testDate: { type: Date },
     startTime: { type: Date },
     endTime: { type: Date },
     maxAttempt: { type: Number },
     isManual: { type: Boolean, default: false },
     tags: [{ type: String }],
     questions: [ {type : Object } ]
   },
   {
     timestamps: true,
   }
 );
 
 bigFiveTestTemplates.method('toJSON', function () {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;
   return object;
 });
 
 bigFiveTestTemplates.plugin(mongoosePaginate);
 
 (module.exports = mongoose.model('bigFiveTestTemplates', bigFiveTestTemplates)),
   mongoosePaginate;
 