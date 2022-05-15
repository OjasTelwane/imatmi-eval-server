/*******************************************************************************************************
 * Tests Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 27/09/2021 Ojas Telwane	created this file
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const tests = new mongoose.Schema(
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
    tagsBucket: [
      {
        tag: { type: String },
        count: { type: Number, default: 0 },
        order: { type: Number, default: 1 },
        level: { type: Number, default: 1 },
        weightage: { type: Number, default: 0 },
        questionCount: { type: Number, default: 0 },
        answerCount: { type: Number, default: 0 },
        finalWeghtage: { type: Number, default: 0 },
      },
    ],
    tagsExtraBucket: [
      {
        tag: { type: String },
        count: { type: Number, default: 0 },
        weightage: { type: Number, default: 0 },
      },
    ],
    questions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

tests.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

tests.plugin(mongoosePaginate);

(module.exports = mongoose.model('tests', tests)), mongoosePaginate;
