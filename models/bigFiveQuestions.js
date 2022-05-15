 const mongoose = require('mongoose');
 const mongoosePaginate = require('mongoose-paginate-v2');
 
 const bigFiveQuestions = new mongoose.Schema(
   {
     questionType: { type: Number, default: 0 },
     isActive: { type: Boolean, default: true },
     isVerified: { type: Boolean },
     verifiedBy: { type: String },
     createdBy: { type: String },
     modifiedBy: { type: String },
     text: { type: String },
     selected_option_id : { type : String, default: 'undefined'},
     files: [
       {
         orderNo: { type: Number, default: 1 },
         src: { type: String },
         fileContentType: { type: String },
         type: { type: String },
       },
     ],
     selections: [
       {
         type: { type: String },
         selection: { type: Object },
       },
     ],
     tags: [{ type: String }],
     tagsBucket: [
       {
         tag: { type: String },
         count: { type: Number, default: 0 },
       },
     ],
     options: [
       {
         setNo: { type: Number, default: 1 },
         orderNo: { type: Number, required: true, default: 1 },
         isCorrect: { type: Boolean, default: false },
         text: { type: String },
         files: [
           {
             orderNo: { type: Number, default: 1 },
             src: { type: String },
             fileContentType: { type: String },
             type: { type: String },
           },
         ],
         selections: [
           {
             type: { type: String },
             selection: { type: Object },
           },
         ],
         tags: [
           {
             tag: { type: String },
             weightage: { type: Number, default: 0 },
           },
         ],
       },
     ],
   },
   {
     timestamps: true,
   }
 );
 
 bigFiveQuestions.method('toJSON', function () {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;
   return object;
 });
 
 bigFiveQuestions.plugin(mongoosePaginate);
 
 (module.exports = mongoose.model('bigFiveQuestions', bigFiveQuestions)), mongoosePaginate;
 