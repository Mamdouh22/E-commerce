const express = require("express");
const { Category } = require("../models/category");
const { Product } = require("../models/product");
const router = express.Router();
const multer = require("multer");

const file_map = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = file_map[file.mimetype];
    let uploadErr = new Error("invalid image extention");
    if (isValid) {
      uploadErr = null;
    }
    cb(uploadErr, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extention = file_map[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extention}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const products = await Product.find().select("name image images");

  if (!products) {
    throw new Error("no products found");
  }
  res.send(products);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ success: false, message: "no product found" });
  }
});

router.get("/prod/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).send({ productCount: productCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "no products found" });
  }
});

router.get("/prod/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    const products = await Product.find({ isFeatures: true }).limit(+count);
    res.status(200).send({ products: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "no products found" });
  }
});

router.get("/prod/cat", async (req, res) => {
  try {
    let filter = {};

    if (req.query.category) {
      filter = { category: req.query.category.split(",") };
    }
    const products = await Product.find(filter).populate("category");
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "no products found" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.send("Invalid category");
  }

  const file = req.file;
  if (!file) {
    res.status(400).send("the request must contain image file");
  }
  const base = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const fileName = req.file.filename;

  const prod = await new Product({
    name: req.body.name,
    image: `${base}${fileName}`,
    description: req.body.description,
    images: req.body.images,
    countInStock: req.body.countInStock,
    category: req.body.category,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatures: req.body.isFeatures,
  });

  await prod.save();
  if (!prod) {
    res.send("product cannot be created!");
  }
  res.send(prod);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  let id = req.params.id;

  const product = await Product.findById(id);
  if (!product) {
    res.status(400).send("no product found");
  }
  const file = req.file;
  let imagePath;
  if (file) {
    const base = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const fileName = req.file.filename;
    imagePath = `${base}${fileName}`;
  } else {
    imagePath = product.image;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        image: imagePath,
        description: req.body.description,
        images: req.body.images,
        countInStock: req.body.countInStock,
        category: req.body.category,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatures: req.body.isFeatures,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(400).send("this product not found please check the id again");
  }
});

router.put("/gallery/:id", upload.array("images", 5), async (req, res) => {
  let id = req.params.id;

  const product = await Product.findById(id);
  if (!product) {
    res.status(400).send("no product found");
  }
  const base = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const files = req.files;
  let imagesPath = [];
  if (files) {
    files.map((file) => {
      imagesPath.push(`${base}${file.filename}`);
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: imagesPath,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(400).send("this product not found please check the id again");
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let product = await Product.findByIdAndRemove(id);
  if (!product) {
    res.status(404).json({ success: false, message: "product not found!" });
  } else {
    res.status(200).json({ success: true, message: "product is deleted!" });
  }
});

module.exports = router;
