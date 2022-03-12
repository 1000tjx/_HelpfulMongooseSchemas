const mongoose = require("mongoose");
const WalletSchema = require("./schemas/wallet");
const PermSchema = require("./schemas/permissions");
const LocationSchema = require("./schemas/location");
const AuthSchema = require("./schemas/auth");

const UserSchema = new mongoose.Schema({
  auth: { type: AuthSchema, default: {} },
  wallet: {
    type: WalletSchema,
    default: {},
  },
  perm: { type: PermSchema, default: {} },
  location: { type: LocationSchema, default: {} },
});

UserSchema.statics = AuthSchema.statics;

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
