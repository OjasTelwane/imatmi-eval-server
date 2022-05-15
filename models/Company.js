/*******************************************************************************************************
 * Company Schema file
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

const companies = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyEmail: { type: String },
    companyContactNo: { type: String },
    companyWebsite: { type: String },
    role: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

companies.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

companies.plugin(mongoosePaginate);

(module.exports = mongoose.model('companies', companies)), mongoosePaginate;
