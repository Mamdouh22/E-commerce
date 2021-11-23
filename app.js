const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const authJwt = require("./helpers/authjwt");
const errorHandling = require("./helpers/errorHandling");
require("dotenv/config");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
// app.use(authJwt());
// app.use(errorHandling);

// Routers
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("database is ready..");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  console.log("backend running on http://localhost:3000");
});
