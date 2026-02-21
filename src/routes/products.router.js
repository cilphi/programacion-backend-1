import { Router } from "express";
import {getProducts, getCategories, getProductById, createProductsCollection, addProduct, updateProduct, deleteProductsCollection, deleteProductById} from "../controllers/product.controllers.js";    

const router = Router();

//GET Todos los productos
router.get('/', getProducts);

//GET Productos por categoría
router.get('/categories', getCategories);

//GET Producto por ID
router.get('/:pid', getProductById);

//POST Crear lista de productos
router.post('/reset', createProductsCollection);

//POST Crear producto
router.post('/', addProduct);

//PUT Actualizar un producto por código
router.put('/code/:code', updateProduct);

//DELETE Borrar todos los productos
router.delete('/all', deleteProductsCollection);

//DELETE Borrar un producto
router.delete('/:pid', deleteProductById);

export default router;