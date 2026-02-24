import {Router} from 'express';
import productsModel from '../models/products.model.js';

const router = Router();

/* Uso Handlebars */
router.get("/",(req,res)=>{
    res.render("index", {title: 'Bienvenida a Ludussus'})
})

/* Rutas con Mongo*/
router.get('/products', (req,res)=>{
    res.render("products", {title: 'Nuestros productos'})
})

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productDetail", { title: "Detalle del producto", product });
    } catch (error) {
        res.status(500).send("Error al cargar detalle");
    }
});

router.get('/carts', (req,res)=>{
    res.render("carts", {title: 'Carro de compras'})
})

export default router;