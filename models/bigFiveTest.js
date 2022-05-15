const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const bigFiveTests = new mongoose.Schema(
  {
    examineeId: { type: String },
    examineeName: { type: String },
    testTemplateId: { type: String },
    testName: { type: String },
    testType: { type: String },
    testDescription: { type: String },
    testDuration: { type: Number },
    testDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },
    maxAttempt: { type: Number },
    isManual: { type: Boolean, default: false },
    score: {
      totalQuestions: { type: Number, default: 0 },
      totalAnswered: { type: Number, default: 0 },
      totalNotAnswered: { type: Number, default: 0 },
      totalMarkedForReview: { type: Number, default: 0 },
      totalCorrectAnswered: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    personalityScore: { type: Object },
    questions: [ {type: Object} ],
    finalResult: {type: Object}
   },
{
  timestamps: true,
   }
 );

bigFiveTests.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

bigFiveTests.plugin(mongoosePaginate);

(module.exports = mongoose.model('bigFiveTests', bigFiveTests)), mongoosePaginate;
