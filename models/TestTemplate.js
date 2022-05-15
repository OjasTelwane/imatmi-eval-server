/*******************************************************************************************************
 * Tests Schema file
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

const test_templates = new mongoose.Schema(
  {
    isVerified: { type: Boolean },
    verifiedBy: { type: String },
    createdBy: { type: String },
    modifiedBy: { type: String },
    testName: { type: String },
    testType: { type: String },
    testDescription: { type: String },
    testDuration: { type: Number },
    testDate: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    maxAttempt: { type: Number },
    isManual: { type: Boolean, default: false },
    tags: [{ type: String }],
    tagsBucket: [
      {
        tag: { type: String },
        order: { type: Number, default: 1 },
        level: { type: Number, default: 1 },
        weightage: { type: Number, default: 0 },
      },
    ],
    questionCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

test_templates.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

test_templates.plugin(mongoosePaginate);

(module.exports = mongoose.model('test_templates', test_templates)),
  mongoosePaginate;
