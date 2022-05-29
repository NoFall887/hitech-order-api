const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    payment_id: {
      required: true,
      type: String,
    },
    cart_id: { required: true, type: mongoose.Schema.Types.ObjectId },
    // shipper_id: {
    //   required: true,
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    status_id: {
      required: true,
      type: String,
      default: "1",
    },
    user_id: { type: Number, required: true },
  },
  { timestamps: { createdAt: "order_date", updatedAt: false } }
);

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };
