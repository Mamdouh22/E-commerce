const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  quantity: {
    type: Number,
  },
});

orderItemSchema.virtual("id").get(function () {
  return this._id.toHexaString();
});
orderItemSchema.set("toJSON", {
  virtual: true,
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = { OrderItem };
