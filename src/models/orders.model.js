import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    cartId: { type: mongoose.Schema.Types.ObjectId },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: Number
        }
    ]
});

const ordersModel = mongoose.model("Order", orderSchema);
export default ordersModel;