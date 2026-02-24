import cartsModel from '../models/carts.model.js';
import productsModel from '../models/products.model.js';
import ordersModel from '../models/orders.model.js';
import mongoose from 'mongoose';
import {  io } from '../../app.js';

//GET Carrito
export const getCarts = async (req, res) => {
    try {
        const carts = await cartsModel.find().populate('products.product');
        res.json({msg: 'Carro:', carts});
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener los carritos'});
    }
};

//GET Carrito por ID
export const getCartById = async (req, res) => {
    const {cid} = req.params;
    const cart = await cartsModel.findById(cid).populate('products.product').lean();
    if (!cart) {
        return res.status(404).json({msg: 'Carrito no encontrado'});
    } return res.json({cart});
};

//POST Crear carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await cartsModel.create({ products: [] });
        const updatedCart = await cartsModel.findById(newCart._id).populate('products.product').lean();
        req.io.emit('cartsUpdated', updatedCart);
        res.json({ ok: true, _id: newCart._id });
    } catch (error) {
        res.status(500).json({ msg: "Error al crear carrito" });
    }
};

//POST Agregar producto al carrito por ID
export const addProductInCartById = async (req,res)=>{
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const qty = Number(quantity);
        const product = await productsModel.findById(pid);
        if (!product) {
            return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
        }
        if (isNaN(qty)) {
            return res.status(400).json({ ok: false, msg: "Cantidad no válida" });
        }
        if (qty <= 0) {
            return res.status(400).json({ ok: false, msg: "Cantidad inválida" });
        }
        if (qty > product.stock) {
            return res.status(400).json({ ok: false, msg: "Stock insuficiente" });
        }
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ ok: false, msg: "Carrito no encontrado" });
        }
        // Verificar si ya existe en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += qty;
        } else {
            cart.products.push({ product: pid, quantity: qty });
        }
        await cart.save();
        // Restar stock
        product.stock -= qty;
        await product.save();
        const updatedCart = await cartsModel.findById(cid).populate('products.product').lean();
        req.io.emit('cartsUpdated', updatedCart);
        return res.json({ ok: true, msg: "Producto agregado al carrito" });
    } catch (error) {
        res.status(500).json({ msg: "Error agregando producto al carrito" });
    }
};

//PUT Actualizar un carrito por ID
export const updateCartById = async (req, res) => {
    try {
        const {cid} = req.params;
        const body = req.body
        if (body.timestamp && typeof body.timestamp !== 'string') {
            res.json({message:"string"})
            return
        }
        if(body.products && !Array.isArray(body.products)) {
            res.json({message:"array"})
            return
        }
        if(body.quantity && typeof body.quantity !== 'number' ) {
            res.json({message:"number"})
            return
        }
        const cartUpdated = await cartsModel.findOneAndUpdate({_id:cid}, body, {returnDocument: 'after'});
        await productsModel.findOneAndUpdate({_id:body.products[0].product}, {$inc: {stock: -body.products[0].quantity}});
        if(!cartUpdated){
            return res.status(404).json({ ok: false });
        }
        const updatedCart = await cartsModel.findById(cid).populate('products.product').lean();
        req.io.emit('cartsUpdated', updatedCart);
        res.json({ ok: true, cart: cartUpdated });
    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el carrito'});
    }
};

//DELETE    Ahora: Borra el id del carro de la sesión en curso.
//          Antes: Borraba la colección y sus datos
//          Para no tener que cambiar todo, se conservó el nombre
export const deleteCartCollection = async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsModel.findById(cid);
    if (!cart) {
        return res.status(404).json({ ok: false, message: 'Carro no encontrado' });
    }
    if (!cart.products.length) {
        return res.json({ ok: false, message: 'El carro está vacío' });
    }
    // Crear orden
    await ordersModel.create({ creationDate: new Date(), cartId: cart._id, products: cart.products });
    // Borrar solo ese carrito
    await cartsModel.findByIdAndDelete(cid, { $set: { products: []}});
    req.io.emit('cartsUpdated', null);
    return res.json({ ok: true, message: 'Orden creada y carrito eliminado' });
};

//DELETE Borrar un producto del carrito por su ID
export const deleteProductInCartById = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ ok: false });
        }
        cart.products = cart.products.filter( p => p.product.toString() !== pid );
        await cart.save();
        const updatedCart = await cartsModel.findById(cid).populate('products.product').lean();
        req.io.emit('cartsUpdated', updatedCart);
        res.json({ ok: true, msg: "Producto eliminado correctamente del carro" });
        } catch (error) {
            res.status(500).json({ ok: false });
    }
};