# Servidor

Con este servidor puedes:

- Borrar y Crear una lista de los productos **=> acción recomendada como inicio del flujo**
- Agregar, Actualizar, Ver detalles y/o Borrar un producto a la lista
- Filtrar por Categorías, Ordenar por precio y avanzar en las páginas para ver los productos de la lista
- Agregar productos al Carro de compras
- Ver el carro de compras, borrar los productos que están en el carro y borrar todos los productos ingresados al carro

Se puede visualizar como API (JSON) o mediante las vistas de handlebars. **Se recomienda generar un codespace en Github para interactuar con el servidor**.

- Framework: Express
- Plataforma: Node.js
- Dependencias: Mongoose, Socket.io, Dotenv
- Lenguaje: JavaScript, Handlebars, CSS

## Iniciar el servidor

### Abrir una nueva terminal

Escribe el comando de inicio:
- Consola: 
```bash
node app.js
```
### Ingresar al Home

Escribe la siguiente URL:
- Barra de direcciones: 
```bash
http://localhost:8080/
```
- Desde Github codespaces debes seguir el link de la URL local que se indica en la pestaña PORT
## Crear la lista

### Write File

Para crear la lista de productos:
- URL: 
```
http://localhost:8080/api/products/reset
```
- Botón: 
```bash
Restaurar Lista de Productos
```
## Método GET

### Get Products

Para ver la lista de productos:
- URL: 
```
http://localhost:8080/api/products
```
- Navbar: 
```
API Productos (JSON)
```
### Get Real Time Products

Para ver la lista de productos manipulada en tiempo real con Socket.io:
- Navbar: 
```
Nuestros Productos
```
- URL: 
```
http://localhost:8080/products
```
- Desde Github codespaces escribir después de la URL https://CODESPACENAME-PORT.app.github.dev
```bash
/products
```
### Get Carts

Para ver el carro de compras:
- Navbar: 
```
API Carro de Compras (JSON)
```
- URL: 
```
http://localhost:8080/api/carts
```
- Desde Github codespaces escribir después de la URL https://CODESPACENAME-PORT.app.github.dev
```bash
/api/carts
```
### Get Real Time Carts

Para ver el carro con productos y manipularla en tiempo real con Socket.io:
- Navbar: 
```
Carro de Compras
```
- URL: 
```
http://localhost:8080/carts
```
- Desde Github codespaces escribir después de la URL https://CODESPACENAME-PORT.app.github.dev
```bash
/carts
```
### Get Product by ID

Para ver un solo producto:
- Escribir después de la URL: http://localhost:8080/api/products/
```
El _id del producto que quieres ver en detalle.
```
- Desde Github codespaces presionar Botón:
```
Ver más
```
### Get Cart by ID

Para ver un solo carro:
- Escribir después de la URL: http://localhost:8080/api/carts/
```
El _id del carro para ver sus detalles.
```
## Método POST

### Crear Producto
- Consola:
```bash 
{
    "title": "Azul",
    "description":"Juego de estrategia y diseño de patrones con azulejos coloridos.",
    "code": "SKU-AZUL",
    "price": 42.5,
    "stock": 10,
    "status": true,
    "category": "Juegos de mesa",
    "thumbnail": "https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__imagepage/img/q4uWd2nXGeEkKDR8Cc3NhXG9PEU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6973671.png"
}
```
Para añadir un producto: 
- Formulario Agregar producto:
```bash 
Botón Crear Producto
```
### Llenar Carro
Para añadir productos a un carro: 
- Consola: **elegir de la lista un _id de producto y copiarlo en el string product**
```bash 
[
    {
        "product": "",
        "quantity": 1
    }
]
```
- Card de producto, o En Detalle de Producto:
```bash 
Botón Agregar al Carrito
```
## Método PUT
Para actualizar un producto: 
- Consola: **Elegir el _id de Ticket To Ride** y Escribir después de la URL http://localhost:8080/api/products/ con el Método PUT de Postman
```bash 
{
    "stock": 10,
    "status": true
}
```
- Formulario Actualizar producto:
```bash 
Botón Actualizar Producto
```
## Método DELETE
### Para eliminar un producto
- Escribir después de la URL: http://localhost:8080/products/
```
El _id del producto
```
- Desde el codespaces ir al card del producto que se desea eliminar y presionar:
```bash
Botón Eliminar Producto
```
### Para eliminar un producto
- Consola: Escribir después de la URL: http://localhost:8080/products/
```
El _id del producto
```
- Desde el codespaces ir al card del producto que se desea eliminar y presionar:
```bash
Botón Eliminar Producto
```
### Eliminar producto en Carro de Compras
- Consola: Escribir después de la URL: http://localhost:8080/carts/_id/products/_id
```
Reemplazar los campos _id primero con el _id del cart y luego el _id del producto
```
- Desde Github codespaces:
```bash
Botón X
```
### Vaciar el Carro de Compras
- Consola: Escribir después de la URL: http://localhost:8080/carts/_id/finalize
```
Reemplazar el campo _id con el _id del cart
```
- Desde Github codespaces:
```bash
Botón Eliminar Carro
```