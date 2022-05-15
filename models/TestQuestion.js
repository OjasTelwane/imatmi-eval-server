/*******************************************************************************************************
 * Test Questions Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	created this file
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const test_questions = new mongoose.Schema(
  {
    testId: { type: Schema.Types.ObjectId, ref: 'tests' },
    duration: { type: Number, default: 0 },
    absentDuration: { type: Number, default: 0 },
    absentTimes: { type: Number, default: 0 },
    status: { type: String },
    isCorrect: { type: Boolean, default: false },
    numberOfAttempts: { type: Number, default: 0 },
    questionId: { type: String },
    questionType: { type: Number, default: 0 },
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
    tags: [{ type: String }],
    tagsBucket: [
      {
        tag: { type: String },
        count: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        weightage: { type: Number, default: 0 },
        finalWeightage: { type: Number, default: 0 },
      },
    ],
    tagsExtraBucket: [
      {
        tag: { type: String },
        count: { type: Number, default: 0 },
      },
    ],
    options: [
      {
        setNo: { type: Number, default: 1 },
        orderNo: { type: Number, default: 0 },
        selectedOrderNo: [{ type: Number, default: 0 }],
        isCorrect: { type: Boolean, default: false },
        selectedOption: { type: Boolean },
        text: { type: String },
        isCorrectOption: { type: Boolean, default: false },
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
            count: { type: Number, default: 0 },
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

test_questions.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

test_questions.plugin(mongoosePaginate);

(module.exports = mongoose.model('test_questions', test_questions)),
  mongoosePaginate;
