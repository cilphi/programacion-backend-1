import {Router} from 'express';

const router = Router();

/* Uso Handlebars */
router.get("/",(req,res)=>{
    res.render("index", {title: 'Bienvenida a Ludussus'})
})

/* Rutas con Mongo*/
router.get('/products', (req,res)=>{
    res.render("products", {title: 'Nuestros productos'})
})

router.get('/products/:pid', (req,res)=>{
    res.render("productDetail", {title: 'Detalle del producto'})
})

router.get('/carts', (req,res)=>{
    res.render("carts", {title: 'Carro de compras'})
})

export default router;