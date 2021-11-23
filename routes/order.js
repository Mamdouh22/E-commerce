const express = require("express");
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const router = express.Router();
const mongoose = require("mongoose");
const castAggregation = require("mongoose-cast-aggregation");

mongoose.plugin(castAggregation);

router.get("/", async (req, res) => {
  const orders = await Order.find().populate("user", "name").populate({
    path: "orderItems",
    populate: "product",
  });

  if (!orders) {
    res.send("no orders found!");
  }
  res.send(orders);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const order = await Order.findById(id);
  if (!order) {
    res.status(400).send("this order not found please check the id again");
  } else {
    res.status(200).send(order);
  }
});

router.get("/get/userorders/:id", async (req, res) => {
  const id = req.params.id;
  const orders = await Order.find({ user: id }).populate({
    path: "orderItems",
    populate: "product",
  });

  if (!orders) {
    res.send("no orders found!");
  }
  res.send(orders);
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    res.status(400).send("no totalSales generating");
  }
  console.log(totalSales);
  res.json({ totalSales: totalSales.pop().totalsales });
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItems = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      await newOrderItems.save();
      return newOrderItems._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItem) => {
      const item = await OrderItem.findById(orderItem).populate(
        "product",
        "price"
      );
      const totalPrice = item.product.price * item.quantity;
      return totalPrice;
    })
  );

  console.log(totalPrices);
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  console.log(totalPrice);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
    price: req.body.price,
    dateOrderd: req.body.dateOrderd,
  });
  await order.save();
  if (!order) {
    res.status(500).send("the Order cannot be created");
  }
  res.send(order);
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  const order = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    res.status(400).send("this order not found please check the id again");
  } else {
    res.status(200).send(order);
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let order = await Order.findByIdAndRemove(id);
  if (!order) {
    res.status(400).json({ success: false, message: "order not found!" });
  }

  const orderItemsIds = Promise.all(
    order.orderItems.map(async (orderItem) => {
      const orderItemDeleted = await OrderItem.findByIdAndRemove(orderItem._id);
      return orderItemDeleted._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  if (!orderItemsIdsResolved) {
    res
      .status(404)
      .json({ success: false, message: "order or orderItems not found!" });
  }
  res
    .status(200)
    .json({ success: true, message: "order and orderItems are deleted!" });
});

module.exports = router;
