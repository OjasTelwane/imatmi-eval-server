/*******************************************************************************************************
 * Lookup Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const lookups = new mongoose.Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'companies' },
    lookupType: { type: String, required: true },
    lookup: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

lookups.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

lookups.plugin(mongoosePaginate);

(module.exports = mongoose.model('lookups', lookups)), mongoosePaginate;
