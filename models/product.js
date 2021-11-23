const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  richDescription: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    required: true,
  },

  images: [
    {
      type: String,
      default: [],
    },
  ],

  brand: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
  },

  rating: {
    type: Number,
    required: true,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  isFeatures: {
    type: Boolean,
    required: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexaString();
});
productSchema.set("toJSON", {
  virtual: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
