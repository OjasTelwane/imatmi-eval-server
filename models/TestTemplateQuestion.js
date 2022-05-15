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

const test_template_questions = new mongoose.Schema(
  {
    testTemplateId: { type: Schema.Types.ObjectId, ref: 'test_templates' },
    questionId: { type: Schema.Types.ObjectId, ref: 'questions' },
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

test_template_questions.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

test_template_questions.plugin(mongoosePaginate);

(module.exports = mongoose.model(
  'test_template_questions',
  test_template_questions
)),
  mongoosePaginate;
