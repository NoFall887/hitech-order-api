const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Orders } = require("./database");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.DB_URL).catch((err) => console.log(err));

function verifyToken(req, res, next) {
  const token = req.cookies.access_token_cookie;
  if (token === null || token == undefined)
    return res.status(401).json({ status: false, message: "unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user_id = parseInt(decoded.id);
    next();
  } catch (error) {
    res.status(400).json({ status: false, message: "Token not valid" });
  }
}

// CREATE NEW ORDER
app.post("/order", verifyToken, (req, res) => {
  var { order_id, amount, payment_details, shipper_id, cart_id } = req.body;

  const newOrder = new Orders({
    order_id: order_id,
    user_id: req.user_id,
    amount: amount,
    payment_details: payment_details,
    shipper_id: shipper_id,
    cart_id: cart_id,
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

// GET ORDERS BASED ON USER ID
app.get("/order", verifyToken, (req, res) => {
  const { userId } = req.query;

  Orders.aggregate((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Error" });
    }

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
      localField: "payment_details.payment_id",
      foreignField: "payment_id",
      as: "payment_details.payment",
    })
    .lookup({
      from: "cart",
      localField: "cart_id",
      foreignField: "_id",
      as: "cart",
    })
    .lookup({
      from: "shipper",
      localField: "shipper_id",
      foreignField: "_id",
      as: "shipper",
    })
    .unwind("status", "payment_details.payment")
    .project({
      status_id: 0,
      shipper_id: 0,
      "payment_details.payment_id": 0,
      cart_id: 0,
    });
});

// UPDATE ORDER STATUS
app.patch("/order/:orderId", verifyToken, async (req, res) => {
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
