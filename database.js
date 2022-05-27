const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // payment: { required: true, type: mongoose.Schema.Types.ObjectId, ref:'payment' },
    // cart: { required: true, type: mongoose.Schema.Types.ObjectId, ref:'cart' },
    // shipper: { required: true, type: mongoose.Schema.Types.ObjectId, ref:'shipper' },
    // user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    user_id: { type: Number, required: true },
    status: {
      code: { required: true, type: Number },
      status_name: { required: true, type: String },
    },
    shipper: { type: Map, required: true },
    cart: { type: Map, required: true },
    payment: { type: Map, required: true },
  },
  { timestamps: { createdAt: "order_date", updatedAt: false } }
);

const Order = mongoose.model("order", orderSchema);

module.exports = { Order };
