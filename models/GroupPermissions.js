/*******************************************************************************************************
 * Group Permission Schema file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const group_permissions = new mongoose.Schema(
  {
    role: { type: String },
    module: { type: String },
    action: { type: String },
    checked: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

group_permissions.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

group_permissions.plugin(mongoosePaginate);

(module.exports = mongoose.model('group_permissions', group_permissions)),
  mongoosePaginate;
