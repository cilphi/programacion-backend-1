import express from 'express';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import {basePath} from './src/utils/utils.js';
import mongoose from 'mongoose';
import viewsRouter from './src/routes/views.router.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';


dotenv.config();
const app = express();
const httpServer = app.listen(process.env.PORT, () => console.log(`Servidor de Express escuchando en el puerto ${process.env.PORT}`));
export const io = new Server(httpServer);

/* Middleware para parsear JSON */
app.use(express.json());

/* Middleware para parsear datos de formularios */
app.use(express.urlencoded({ extended: true }));

/* Handlebars*/
app.use(express.static(basePath + '/public'))
app.use(express.static(basePath + '/src/managers'))
app.engine('handlebars', handlebars.engine({
    partialsDir: (basePath + '/src/views/partials')
}));
app.set('views', basePath + '/src/views');
app.set('view engine', 'handlebars');

/* Mongoose */
const environment = async () => {
    mongoose.connect(process.env.MONGODB_URI);
}
environment();

app.use((req, res, next) => {
    req.io = io;
    next();
});

/*Rutas */
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

/* Sockets */
io.on('connection', socket => {
    console.log('Cliente conectado:', socket.id);
});