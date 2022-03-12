/**
 * ref:
 * https://www.npmjs.com/package/jsonwebtoken
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_WORK_FACTOR = 124223;
const SECRET = "A?Pq@z@@c_d436!@";

const AuthSchema = new mongoose.Schema({
  // login
  username: String,
  password: String,
  email: String,
  // codes
  code: String,
  // profile info
  name: String,
  phone: String,
  pic: String,
  cover: String,
  // user type
  userType: {
    type: String,
    enum: ["user", "admin", "employee"],
    default: "user",
  },
});

AuthSchema.pre("save", function (next) {
  let user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

AuthSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

AuthSchema.methods.signJWT = function (data) {
  return jwt.sign(data || this, SECRET);
};

AuthSchema.methods.generateCode = function (codeLength) {
  if (codeLength < 3) throw "Code length must be at least 3";
  const code = Math.floor(Math.random() * Math.pow(10, codeLength));
  this.code = code;
  return this.code;
};

AuthSchema.statics.verifyJWT = function (token) {
  try {
    return jwt.verify(token, SECRET, {
      ignoreExpiration: true,
    });
  } catch (_) {
    return null;
  }
};

module.exports = AuthSchema;
