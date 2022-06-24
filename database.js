const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart_id: {
      required: true,
      // type: mongoose.Schema.Types.ObjectId
      type: mongoose.Schema.Types.Mixed,
    },
    shipper_id: {
      required: true,
      // type: mongoose.Schema.Types.ObjectId,
      type: mongoose.Schema.Types.Mixed,
    },
    status_id: {
      required: true,
      type: String,
      default: "1",
    },
    user_id: { type: Number, required: true },
    order_id: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_details: { type: Object, required: true },
  },
  {
    timestamps: { createdAt: "order_date", updatedAt: false },
    versionKey: false,
  }
);

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };
