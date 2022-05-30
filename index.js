const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { Orders } = require("./database");
require("dotenv").config();

app.use(express.json());
mongoose.connect(process.env.DB_URL).catch((err) => console.log(err));

app.post("/order", (req, res) => {
  var { paymentId, shipperId, cartId, userId } = req.body;
  const newOrder = new Orders({
    user_id: userId,
    payment_id: paymentId,
    shipper_id: shipperId,
    cart_id: cartId,
  });

  newOrder.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }
    console.log(data);
    return res.json({ data: data, status: true, message: "order dibuat" });
  });
});

app.get("/order", (req, res) => {
  const { userId } = req.query;

  Orders.aggregate((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }
    console.log(data);
    return res.json({ data: data, status: true, message: "success" });
  })
    .match({ user_id: parseInt(userId) })
    .lookup({
      from: "status",
      localField: "status_id",
      foreignField: "status_id",
      as: "status",
    })
    .lookup({
      from: "payment",
      localField: "payment_id",
      foreignField: "payment_id",
      as: "payment",
    })
    .lookup({
      from: "cart",
      localField: "status_id",
      foreignField: "_id",
      as: "cart",
    })
    .lookup({
      from: "shipper",
      localField: "shipper_id",
      foreignField: "_id",
      as: "shipper",
    })
    .unwind("status", "payment");
});

app.patch("/order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const statusIdRange = [1, 2, 3, 4];
  const order = await Orders.findById(orderId);

  if (!statusIdRange.includes(newStatus)) {
    return res.status(400).json({ status: false, message: "id status salah" });
  }

  order.status_id = newStatus;

  order.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }
    return res.json({
      data: data,
      status: true,
      message: "status pesanan berhasil diupdate",
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port " + listener.address().port);
});
