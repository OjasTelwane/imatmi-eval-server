/*******************************************************************************************************
 * User Permissions Schema file
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

const user_permissions = new mongoose.Schema(
  {
    userId: { type: String },
    userName: { type: String },
    module: { type: String },
    action: { type: String },
    checked: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

user_permissions.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

user_permissions.plugin(mongoosePaginate);

(module.exports = mongoose.model('user_permissions', user_permissions)),
  mongoosePaginate;
