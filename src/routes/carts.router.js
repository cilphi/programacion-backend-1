import { Router } from "express";
import { getCarts, getCartById, createCart , addProductInCartById, updateCartById , deleteCartCollection, deleteProductInCartById } from "../controllers/carts.controllers.js";

const router = Router();

//GET Carro
router.get('/', getCarts);

//GET Carrito por ID
router.get('/:cid', getCartById);

//POST Crear carrito
router.post('/', createCart);

//POST Agregar producto al carrito por ID
router.post("/:cid/products/:pid",addProductInCartById);

//PUT Actualizar un producto del carrito por su ID
router.put('/:cid/products/:pid', updateCartById);

//DELETE Borrar la colección y sus datos
router.delete('/all', deleteCartCollection);

//DELETE Borrar un producto del carrito por su ID
router.delete('/:cid/products/:pid', deleteProductInCartById);

export default router;