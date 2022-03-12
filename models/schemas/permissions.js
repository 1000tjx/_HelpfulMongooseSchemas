const mongoose = require("mongoose");

const FIELD_ERR = " is not a valid permission field.";

const PermissionsSchema = new mongoose.Schema({
  // users
  addUsers: { type: Boolean, default: false },
  editUsers: { type: Boolean, default: false },
  deleteUsers: { type: Boolean, default: false },
});

PermissionsSchema.methods.set = function (permissionsList, value) {
  permissionsList.forEach((p) => {
    if (this[p] === undefined) throw p + FIELD_ERR;
    this[p] = value || false;
  });
};

PermissionsSchema.methods.hasAll = function (permissionsList) {
  return permissionsList
    .map((p) => {
      if (this[p] == undefined) throw p + FIELD_ERR;
      return this[p];
    })
    .every((p) => p === true);
};

PermissionsSchema.methods.hasSome = function (permissionsList) {
  return permissionsList
    .map((p) => {
      if (this[p] == undefined) throw p + FIELD_ERR;
      return this[p];
    })
    .some((p) => p === true);
};

module.exports = PermissionsSchema;
