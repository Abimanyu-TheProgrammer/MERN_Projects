const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const formidable = require('formidable') // for file uploads (through forms)
const fs = require('fs')
const productById = require("../middleware/productById")


// todo Change the access to public later

// @route   POST api/product
// @desc    Create a Product
// @access  Private Admin
router.post("/", auth, adminAuth, (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error : "Image could not be uploaded"
            })
        }

        if(!files.photo){
            return res.status(400).json({
                error : "Image is required"
            })
        }

        if(files.photo.type !== 'image/jpeg' && files.photo.type !== 'image/jpg' && files.photo.type !== 'image/png') {
            return res.status(400).json({
                error: "Image type not allowed"
            })
        }
        
        // Check for all fields
        const{name, description, price, category, quantity, shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            })       
        }

        let product = new Product(fields)
        if (files.photo.size > 1000000){
            return res.status(400).json({
                error: "Image should be less than 1 MB"
            })
        }

        product.photo.data = fs.readFileSync(files.photo.path)
        product.photo.contentType = files.photo.type
    
        try {
            await product.save()
            res.json("Product Created Successfully")
        } catch (error) {
            console.log(error)
            res.status(500).send("Server Error")
        }
    })
})

// @route   GET api/product/list
// @desc    Get a list of products
// options(order = asc or desc, sortBy any product property, and limit number of returned product)
// @access  Public

router.get('/list', async (req, res) => {
    let order = req.query.order ? req.query.order : "asc"
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? req.query.limit : 6

    try {
        let products = await Product.find({}).select("-photo").populate("category").sort([[sortBy, order]]).limit(limit).exec()
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).send("Invalid Queries")
    }
})


// @route   GET api/product/search
// @desc    Get a list of products through a query
// options(order = asc or desc, sortBy any product property, and limit number of returned product)
// @access  Public

router.get('/search', async (req, res) => {
    const query = {}

    if(req.query.search) {
        query.name = {
            $regex : req.query.search,
            $options : 'i'
        }
    }

    if(req.query.category && req.query.category != 'All'){
        query.category = req.query.category
    }

    try {
        let products = await Product.find(query).select("-photo")
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error getting products")
    }
})


// @route   GET api/product/productId
// @desc    Get a single Product
// @access  Public
router.get("/:productId", productById, (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}) 


// @route   GET api/product/photo/productId
// @desc    Get a product's image
// @access  Public
router.get('/photo/:productId', productById, (req,res) => {
    
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }

    res.status(400).json({
        error : "Failed to load image"
    })
})

module.exports = router