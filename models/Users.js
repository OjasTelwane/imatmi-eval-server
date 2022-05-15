const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let Schema = mongoose.Schema;

const users = new Schema(
  {
    companyId: {
      type: String,
      required: false,
    },
    empId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    isFirstTime: {
      type: Boolean,
      required: false,
      default: true,
    },
    userPermissions: [],
  },
  {
    timestamps: true,
  }
);

users.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

users.plugin(mongoosePaginate);

(module.exports = mongoose.model('users', users)), mongoosePaginate;
