/*******************************************************************************************************
 * Tags Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tags = new mongoose.Schema(
  {
    tag: { type: String, required: true, unique: true },
    tagType: {
      type: String,
      required: false,
      enum: ['Quality', 'Profession', 'Position'],
      default: 'Quality',
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

tags.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

tags.plugin(mongoosePaginate);

(module.exports = mongoose.model('tags', tags)), mongoosePaginate;
