const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { Order } = require("./database");
require("dotenv").config();

app.use(express.json());
mongoose.connect(process.env.DB_URL).catch((err) => console.log(err));

app.post("/order", (req, res) => {
  var { paymentData, shipperData, cartData, userId } = req.body;
  // var {paymentId, shipperId, cartId, userId} = req.body
  const newOrder = new Order({
    user_id: userId,
    payment: paymentData,
    shipper: shipperData,
    cart: cartData,
    status: {
      code: 1,
      status_name: "diproses",
    },
  });

  newOrder.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }

    return res.json({ data: data, status: true, message: "order dibuat" });
  });
});

app.get("/order", (req, res) => {
  const { userId } = req.query;

  // Order.findById(userId, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).json({ status: false, message: "Error" });
  //   }
  //   return res.json({ data: data, status: true, message: "success" });
  // });

  Order.find({ user_id: 4 }, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }
    return res.json({ data: data, status: true, message: "success" });
  });
});

app.patch("/order/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  const order = Order.findById(orderId);

  function updateOrderStatus(code, statusName) {
    order.status = {
      code: code,
      status_name: statusName,
    };
    order.save((err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: "Error" });
      }
      return res.json({ data: data, status: true, message: "update success" });
    });
  }

  switch (newStatus) {
    case 1:
      updateOrderStatus(1, "diproses");
      break;
    case 2:
      updateOrderStatus(2, "dikirim");
    case 3:
      updateOrderStatus(3, "selesai");
    default:
      return res
        .status(400)
        .json({ status: false, message: "wrong status code" });
      break;
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port " + listener.address().port);
});
