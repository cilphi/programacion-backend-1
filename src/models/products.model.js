import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true }
});
productsSchema.index({category: 1, status: -1 }); //Indexar status para mostrar productos disponibles por categoría
productsSchema.index({ price:1 }); //Indexar price para orden descendente

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model('Product', productsSchema);
export default productsModel;