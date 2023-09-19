const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
// const mongooose = require('mongoose');

require('./db/config')
const User = require("./db/User")
const Products = require("./db/Products")
const multer = require('multer');
const path = require('path');

const app = express();
// app.use(express.json())
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://e-com-app-rose.vercel.app"],
    methods: ["POST","GET","DELETE","PUT"],
    credentials: true
}))

app.get("/", async (req, res) => {
    res.send("Hello");
})

app.post("/register", async (req, res) => {
    let user = new User(req.body)
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})

app.post("/login", async (req, res) => {
    if (req.body.email && req.body.password) {
        const user = await User.findOne(req.body).select('-password');
        if (user) {
            res.send(user);
        } else {
            res.send('User not found');
        }
    } else {
        res.send('User not found');
    }

})

// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, callback) => {
//         callback(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage });

app.post('/add-products', async (req, res) => {
    const { brand, country, founded, userId, image } = req.body;
    // Check if any required field is missing
    if (!brand || !country || !founded || !userId || !image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const product = new Products({
            brand,
            country,
            founded,
            userId,
            image,
        });

        const result = await product.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get("/products", async (req, res) => {
    let productsList = await Products.find()
    res.send(productsList);
})

app.delete("/delete-product/:id", async (req, res) => {
    let result = await Products.deleteOne({ _id: req.params.id })
    if (!result.ok == 200) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.send({ result, message: 'Product deleted' });
})

app.put("/update-product/:id", async (req, res) => {
    const { brand, country, founded, userId, image } = req.body;

    // Check if any required field is missing
    if (!brand || !country || !founded || !userId || !image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const product = new Products({
            brand,
            country,
            founded,
            userId,
            image,
        });

        let result = await Products.updateOne({ _id: req.params.id }, { $set: req.body })
        res.status(200).json({ message: 'Product updated', result });
    } 
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

// app.listen(3500,()=>{
//     console.log("server is running")
// });
