const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    default: "",
  },

  apartment: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    required: true,
  },

  zip: {
    type: String,
    default: "",
  },

  country: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    default: 0,
  },

  isAdmin: {
    type: Boolean,
    required: false,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexaString();
});
userSchema.set("toJSON", {
  virtual: true,
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
