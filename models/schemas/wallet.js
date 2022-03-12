const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  balanceInUse: { type: Number, default: 0 },
  useableBalance: { type: Number, default: 0 },
  dept: { type: Number, default: 0 },
  history: [
    {
      date: Date,
      value: Number,
      field: String,
      type: {
        type: String,
        enum: ["cash", "credit", "cut", "updateBalanceInUse"],
        default: "cash",
      },
    },
  ],
});

WalletSchema.methods.addToWallet = function ({
  value = 0,
  type = "cash",
} = {}) {
  // Add A value to Wallet, this will add a history too
  // you can use negative or positive values
  // as negative values, the type of history will be always 'cut'
  this.calculateFields();
  this.balance = this.balance += value;
  // check if the value is negative
  if (value < 0) {
    type = "cut";
  }
  // add to history
  this.history.push({
    date: new Date(),
    value,
    type,
    field: "balance",
  });
  this.calculateFields();
};

WalletSchema.methods.addToBalanceInUse = function ({ value = 0 } = {}) {
  // Add A value to balanceInUse field, this will add a history too
  // you can use negative or positive values
  // as negative values, the type of history will be always 'cut'
  this.calculateFields();
  if (value > this.getUseableBalance() || this.getUseableBalance() === 0) {
    throw `Cannot add (${value}) to balanceInUse, reason: dept == ${this.dept}`;
    return false;
  }
  this.balanceInUse = this.balanceInUse += value;
  // add to history
  this.history.push({
    date: new Date(),
    value,
    type: "updateBalanceInUse",
    field: "balanceInUse",
  });
  this.calculateFields();
  return true;
};

WalletSchema.methods.getUseableBalance = function () {
  return this.balance > 0 ? this.balance - this.balanceInUse : 0;
};

WalletSchema.methods.getDept = function () {
  return this.balance < 0 ? this.balance : 0;
};

WalletSchema.methods.calculateFields = function () {
  this.dept = this.getDept();
  this.useableBalance = this.getUseableBalance();
};

WalletSchema.pre("save", function () {
  this.calculateFields();
});

module.exports = WalletSchema;
