import mongoose from "mongoose";


const cartsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    products:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {
                type: Number, default: 1, min: 1}
        }
    ]
});

const cartsModel = mongoose.model('Cart', cartsSchema);
export default cartsModel;