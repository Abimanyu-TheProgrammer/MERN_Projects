const { default: slugify } = require('slugify')
const Product = require('../models/Product')




exports.createProduct = (req, res) => {

    var productPictures = []
    if(req.files.length > 0){
        productPictures = req.files.map(file => {
            return {img : file.filename}
        })
    } else {
        return res.status(400).json({
            error : "Image is required"
        })
    }

    for(var i = 0 ; i < productPictures ; i++){
        if(productPictures[i].mimetype !== 'image/jpeg' && productPictures[i].mimetype !== 'image/jpg' && productPictures[i].mimetype !== 'image/png') 
            return res.status(400).json({
                message: "Image type not allowed"
            })
    }
    
    const {name, price, description,  category, quantity} = req.body
    if(!name || !description || !price || !category || !quantity) {
        return res.status(400).json({
            error: "All fields are required"
        })       
    }

    const product = new Product({
        name,
        slug : slugify(name),
        price,
        description,
        productPictures,
        category,
        quantity,
        createdBy : req.user._id
    }) 

    product.save((error, product) => {
        if(error) return res.status(400).json({error})
        if(product) return res.status(201).json({product})
    })

}