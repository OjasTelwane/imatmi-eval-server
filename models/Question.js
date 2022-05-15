/*******************************************************************************************************
 * Tags Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/09/2021 Ojas Telwane	Modified to Add voided, isVerified,
 * 													ques Section fileContentType, multiple tags in question
 * 													options section added setNo, file, fileContentType,
 * 													changed tag section to tags section, added tag and weightage
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const questions = new mongoose.Schema(
  {
    questionType: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean },
    verifiedBy: { type: String },
    createdBy: { type: String },
    modifiedBy: { type: String },
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

questions.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

questions.plugin(mongoosePaginate);

(module.exports = mongoose.model('questions', questions)), mongoosePaginate;
