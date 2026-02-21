import productsModel from "../models/products.model.js";
import { io } from '../../app.js';

//GET Todos los productos
export const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const category = req.query.category;
        const sort = req.query.sort;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        const sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        if (sort === 'desc') sortOption.price = -1;
        const result = await productsModel.paginate(filter, {
            page,
            limit: 10,
            sort: sortOption,
            lean: true
        });
        res.json({
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener productos'
        });
    }
};

//GET Categorías de productos
export const getCategories = async (req, res) => {
    try {
        const categories = await productsModel.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            msg: 'Error obteniendo categorías'
        });
    }
};

//GET Producto por ID
export const getProductById = async (req, res) => {
    try {
    const product = await productsModel.findById(req.params.pid).lean();
    res.json(product);
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener el producto'});
    }
};

//POST Crear lista de productos
export const createProductsCollection = async (req, res) => {
    try {
        const newProductList = [
        {
            title:"Brass: Birmingham",
            description:"Brass: Birmingham is an economic strategy game sequel to Martin Wallace' 2007 masterpiece, Brass. Brass: Birmingham tells the story of competing entrepreneurs in Birmingham during the industrial revolution, between the years of 1770-1870.",
            code: "SKU-BRASS",
            price: 60,
            stock: 10,
            status: true,
            category:"Transportation",
            thumbnail:"https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__thumb/img/o18rjEemoWaVru9Y2TyPwuIaRfE=/fit-in/200x150/filters:strip_icc()/pic3490053.jpg"
        },
        {
            title:"Pandemic Legacy: Season 1",
            description:"Pandemic Legacy is a co-operative campaign game, with an overarching story-arc played through 12-24 sessions, depending on how well your group does at the game.",
            code: "SKU-PAND",
            price: 50,
            stock: 5,
            status: true,
            category:"Medical",
            thumbnail:"https://cf.geekdo-images.com/-Qer2BBPG7qGGDu6KcVDIw__thumb/img/NQQcjS31TO0DE246N9rpt0hd9eo=/fit-in/200x150/filters:strip_icc()/pic2452831.png"
        },
        {
            title: "Ticket to Ride",
            description: "Ticket to Ride is a popular, family-friendly, 2–5 player strategy board game where players compete to build train routes across a map. Players collect color-matched train cards to claim routes, connecting cities to fulfill destination tickets for bonus points. The game features simple rules and lasts about 30–60 minutes.",
            code: "SKU-TTR",
            price: 49,
            stock: 0,
            status: false,
            category:"Strategy",
            thumbnail:"https://cf.geekdo-images.com/V0msvUF059EyaHqJlib3zA__imagepagezoom/img/Oczzk307GcPf4PR2vYF6KrkrIm8=/fit-in/1200x900/filters:no_upscale():strip_icc()/pic106877.jpg"
        },
        {
            title:"Gloomhaven",
            description:"Gloomhaven  is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world.",
            code: "SKU-GLOOM",
            price: 100,
            stock: 2,
            status: true,
            category:"Miniatures",
            thumbnail:"https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__thumb/img/veqFeP4d_3zNhFc3GNBkV95rBEQ=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg"
        },
        {
            title:"Ark Nova",
            description:"In Ark Nova, you will plan and design a modern, scientifically managed zoo. With the ultimate goal of owning the most successful zoological establishment, you will build enclosures, accommodate animals, and support conservation projects all over the world.",
            code: "SKU-ARK",
            price: 70,
            stock: 8,
            status: true,
            category:"Environmental",
            thumbnail:"https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__thumb/img/4KuHNTWSMPf8vTNDKSRMMI3oOv8=/fit-in/200x150/filters:strip_icc()/pic6293412.jpg"
        },
        {
            title:"Twilight Imperium: Fourth Edition",
            description:"Twilight Imperium (Fourth Edition) is a game of galactic conquest in which three to six players take on the role of one of seventeen factions vying for galactic domination through military might, political maneuvering, and economic bargaining.",
            code: "SKU-TI",
            price: 120,
            stock: 4,
            status: true,
            category:"Wargame",
            thumbnail:"https://cf.geekdo-images.com/_Ppn5lssO5OaildSE-FgFA__thumb/img/lfEukJE0JsoZZObaF9K9YnFp62E=/fit-in/200x150/filters:strip_icc()/pic3727516.jpg"
        },
        {
            title:"Dune: Imperium",
            description:"Dune: Imperium is a game that uses deck-building to add a hidden-information angle to traditional worker placement. It finds inspiration in elements and characters from the Dune legacy, both the new film from Legendary Pictures and the seminal literary series from Frank Herbert, Brian Herbert, and Kevin J. Anderson.",
            code: "SKU-DUNE",
            price: 80,
            stock: 6,
            status: true,
            category:"Science Fiction",
            thumbnail:"https://cf.geekdo-images.com/PhjygpWSo-0labGrPBMyyg__thumb/img/JGgY-nBmkyB8WRp8vcoBLlNMQ5U=/fit-in/200x150/filters:strip_icc()/pic5666597.jpg"
        },
        {
            title:"Terraforming Mars",
            description:"In the 2400s, mankind begins to terraform the planet Mars. Giant corporations, sponsored by the World Government on Earth, initiate huge projects to raise the temperature, the oxygen level, and the ocean coverage until the environment is habitable.",
            code: "SKU-TM",
            price: 90,
            stock: 5,
            status: true,
            category:"Territory Building",
            thumbnail:"https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__thumb/img/BTxqxgYay5tHJfVoJ2NF5g43_gA=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg"
        },
        {
            title:"War of the Ring: Second Edition",
            description:"In War of the Ring, one player takes control of the Free Peoples (FP), the other player controls Shadow Armies (SA). Initially, the Free People Nations are reluctant to take arms against Sauron, so they must be attacked by Sauron or persuaded by Gandalf or other Companions, before they start to fight properly: this is represented by the Political Track, which shows if a Nation is ready to fight in the War of the Ring or not.",
            code: "SKU-WOTR",
            price: 100,
            stock: 3,
            status: true,
            category:"Wargame",
            thumbnail:"https://cf.geekdo-images.com/ImPgGag98W6gpV1KV812aA__thumb/img/X-lBBdG4uO6LT0y1vXxCN4jdR4M=/fit-in/200x150/filters:strip_icc()/pic1215633.jpg"
        },
        {
            title:"Gloomhaven: Jaws of the Lion",
            description:"Gloomhaven: Jaws of the Lion is a standalone game that takes place before the events of Gloomhaven. Is aimed at a more casual audience to get people into the gameplay more quickly. All of the hard-to-organize cardboard map tiles have been removed, and instead players will play on the scenario book itself, which features new artwork unique to each scenario.",
            code: "SKU-GJL",
            price: 50,
            stock: 7,
            status: true,
            category:"Miniatures",
            thumbnail:"https://cf.geekdo-images.com/_HhIdavYW-hid20Iq3hhmg__thumb/img/OMkN_E5eyWrkID_cHCnQEbIixGM=/fit-in/200x150/filters:strip_icc()/pic5055631.jpg"
        },
        {
            title:"Star Wars: Rebellion",
            description:"Star Wars: Rebellion is a board game of epic conflict between the Galactic Empire and Rebel Alliance for two to four players.Experience the Galactic Civil War like never before. In Rebellion, you control the entire Galactic Empire or the fledgling Rebel Alliance.",
            code: "SKU-SWR",
            price: 120,
            stock: 4,
            status: true,
            category:"Wargame",
            thumbnail:"https://cf.geekdo-images.com/7SrPNGBKg9IIsP4UQpOi8g__thumb/img/gAxzddRVQiRdjZHYFUZ2xc5Jlbw=/fit-in/200x150/filters:strip_icc()/pic4325841.jpg"
        },
        {
            title:"Spirit Island",
            description:"In the most distant reaches of the world, magic still exists, embodied by spirits of the land, of the sky, and of every natural thing. As the great powers of Europe stretch their colonial empires further and further, they will inevitably lay claim to a place where spirits still hold power - and when they do, the land itself will fight back alongside the islanders who live there.",
            code: "SKU-SPI",
            price: 80,
            stock: 2,
            status: true,
            category:"Territory Building",
            thumbnail:"https://cf.geekdo-images.com/kjCm4ZvPjIZxS-mYgSPy1g__thumb/img/aUlIih2_R7P8IYKeyNl2heLQbu8=/fit-in/200x150/filters:strip_icc()/pic7013651.jpg"
        },
        {
            title:"Gaia Project",
            description:"Gaia Project is a new game in the line of Terra Mystica. As in the original Terra Mystica, fourteen different factions live on seven different kinds of planets, and each faction is bound to their own home planets, so to develop and grow, they must terraform neighboring planets into their home environments in competition with the other groups. In addition, Gaia planets can be used by all factions for colonization, and Transdimensional planets can be changed into Gaia planets.",
            code: "SKU-GAI",
            price: 150,
            stock: 3,
            status: true,
            category:"Territory Building",
            thumbnail:"https://cf.geekdo-images.com/hGWFm3hbMlCDsfCsauOQ4g__thumb/img/NNG7Ijyx4evp5gcVReis9i0koas=/fit-in/200x150/filters:strip_icc()/pic5375625.png"
        },
        {
            title:"Twilight Struggle",
            description:"Now the trumpet summons us again, not as a call to bear arms, though arms we need; not as a call to battle, though embattled we are but a call to bear the burden of a long twilight struggle... John F. KennedyIn 1945, unlikely allies toppled Hitler's war machine, while humanity's most devastating weapons forced the Japanese Empire to its knees in a storm of fire. Where once there stood many great powers, there then stood only two. The world had scant months to sigh its collective relief before a new conflict threatened.",
            code: "SKU-TS",
            price: 60,
            stock: 5,
            status: true,
            category:"Wargame",
            thumbnail:"https://cf.geekdo-images.com/pNCiUUphnoeWOYfsWq0kng__thumb/img/p7alNkNy8Avm8UISmhYHCiMz5bE=/fit-in/200x150/filters:strip_icc()/pic3530661.jpg"
        },
        {
            title:"Through the Ages: A New Story of Civilization",
            description:"Through the Ages: A New Story of Civilization is the new edition of Through the Ages: A Story of Civilization, with many changes small and large to the game's cards over its three ages and extensive changes to how military works.Through the Ages is a civilization building game.",
            code: "SKU-TTA",
            price: 120,
            stock: 4,
            status: true,
            category:"Economic",
            thumbnail:"https://cf.geekdo-images.com/fVwPntkJKgaEo0rIC0RwpA__thumb/img/31usGlzlBReEFf60bcgbvDTjwCg=/fit-in/200x150/filters:strip_icc()/pic2663291.jpg"
        },
        {
            title:"Great Western Trail",
            description:"America in the 19th century: You are a rancher and repeatedly herd your cattle from Texas to Kansas City, where you send them off by train. This earns you money and victory points. Needless to say, each time you arrive in Kansas City, you want to have your most valuable cattle in tow. However, Great Western Trail not only requires that you keep your herd in good shape, but also that you wisely use the various buildings along the trail. Also, it might be a good idea to hire capable staff: cowboys to improve your herd, craftsmen to build your very own buildings, or engineers for the important railroad line. If you cleverly manage your herd and navigate the opportunities and pitfalls of Great Western Trail, you surely will gain the most victory points and win the game.",
            code: "SKU-GWT",
            price: 80,
            stock: 6,
            status: true,
            category:"Economic",
            thumbnail:"https://cf.geekdo-images.com/u1l0gH7sb_vnvDvoO_QHqA__thumb/img/9lxFidyDb8j6D1vobx4e3UwZ-FI=/fit-in/200x150/filters:strip_icc()/pic4887376.jpg"
        },
        {
            title:"The Castles of Burgundy",
            description:"The game is set in the Burgundy region of High Medieval France. Each player takes on the role of an aristocrat, originally controlling a small princedom. While playing they aim to build settlements and powerful castles, practice trade along the river, exploit silver mines, and use the knowledge of travelers.",
            code: "SKU-COB",
            price: 70,
            stock: 8,
            status: true,
            category:"Territory Building",
            thumbnail:"https://cf.geekdo-images.com/5CFwjd8zTcGYVUnkXh04hw__thumb/img/0AG_6zsfYQjqlUHG0-_8lcjp8rc=/fit-in/200x150/filters:strip_icc()/pic1176894.jpg"
        },
        {
            title:"Scythe",
            description:"It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. The capitalistic city-state known simply as The Factory, which fueled the war with heavily armored mechs, has closed its doors, drawing the attention of several nearby countries. Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor.",
            code: "SKU-SCY",
            price: 90,
            stock: 5,
            status: true,
            category:"Territory Building",
            thumbnail:"https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__thumb/img/eQ69OEDdjYjfKg6q5Navee87skU=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg"
        },
        {
            title:"Eclipse: Second Dawn for the Galaxy",
            description:"A game of Eclipse places you in control of a vast interstellar civilization, competing for success with its rivals. You explore new star systems, research technologies, and build spaceships with which to wage war. There are many potential paths to victory, so you need to plan your strategy according to the strengths and weaknesses of your species, while paying attention to the other civilizations' endeavors.",
            code: "SKU-ESD",
            price: 100,
            stock: 3,
            status: true,
            category:"Wargame",
            thumbnail:"https://cf.geekdo-images.com/Oh3kHw6lweg6ru71Q16h2Q__thumb/img/e9XZdQe1ZcPpaq4Gy31OoWBB_V0=/fit-in/200x150/filters:strip_icc()/pic5235277.jpg"
        },
        {
            title:"7 Wonders Duel",
            description:"In many ways 7 Wonders Duel resembles its parent game 7 Wonders. Over three ages, players acquire cards that provide resources or advance their military or scientific development in order to develop a civilization and complete wonders. What's different about 7 Wonders Duel is that, as the title suggests, the game is solely for two players.",
            code: "SKU-7WD",
            price: 80,
            stock: 6,
            status: true,
            category:"Economic",
            thumbnail:"https://cf.geekdo-images.com/zdagMskTF7wJBPjX74XsRw__thumb/img/gV1-ckZSIC-dCxxpq1Y7GmPITzQ=/fit-in/200x150/filters:strip_icc()/pic2576399.jpg"
        },
        {
            title:"Brass: Lancashire",
            description:"Brass: Lancashire first published as Brass is an economic strategy game that tells the story of competing cotton entrepreneurs in Lancashire during the industrial revolution. You must develop, build, and establish your industries and network so that you can capitalize demand for iron, coal and cotton.",
            code: "SKU-BL",
            price: 95,
            stock: 4,
            status: true,
            category:"Transportation",
            thumbnail:"https://cf.geekdo-images.com/tHVtPzu82mBpeQbbZkV6EA__thumb/img/AghH1bAEhqzvyRcP3cy5G-rz0So=/fit-in/200x150/filters:strip_icc()/pic3469216.jpg"
        }
    ];
    await productsModel.insertMany(newProductList);
        const products = await productsModel.find().lean();
        io.emit('productsUpdated', products);
        return res.json({ ok: true, message: 'La colección Products ha sido creada', products: newProductList });
    } catch (error) {
        console.error('Error en el endpoint reset:', error);
        return res.status(500).json({ ok: false, message: 'Error creando la colección Products' });
    }
};

//POST Crear producto
export const addProduct = async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.description || !body.price || !body.code || !body.stock || !body.category || !body.thumbnail) {
            return res.status(400).json({ ok: false, msg: 'Faltan datos obligatorios' });
        }
        const newProduct = await productsModel.create(body);
        io.emit('productsUpdated', newProduct);
        res.json({ ok: true, msg: 'Producto agregado', product: newProduct });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
};

//PUT Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
    const {code} = req.params;
    const body = req.body;
    const updatedProduct = await productsModel.findOneAndUpdate({code:code}, body, {returnDocument: 'after'});
    if (!updatedProduct) {
        return res.status(404).json({ returnDocument: 'after', msg: 'Producto no encontrado' });
    }
    const products = await productsModel.find();
    io.emit('productsUpdated', products);
    res.json({ ok: true, msg: 'Producto actualizado', product: updatedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el producto'});
    }
};

//DELETE Borrar la colección de productos
export const deleteProductsCollection = async (req, res) => {
    try {
        const result = await productsModel.deleteMany({});
        const products = await productsModel.find();
        io.emit('productsUpdated', products);
        return res.json({ ok: true, message: 'La colección Products ha sido eliminada', deletedCount: result.deletedCount });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error borrando la colección' });
    }
};

//DELETE Borrar un producto por ID
export const deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await productsModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
        }
        const products = await productsModel.find();
        io.emit('productsUpdated', products);
        res.json({ ok: true, msg: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al eliminar producto" });
    }
};
