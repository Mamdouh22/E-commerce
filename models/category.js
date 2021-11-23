const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  color: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexaString();
});
categorySchema.set("toJSON", {
  virtual: true,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
