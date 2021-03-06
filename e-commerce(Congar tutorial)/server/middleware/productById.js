const mongoose = require('mongoose')
const Product = require('../models/Product')

module.exports = async function (req, res, next) {
    const {productId} = req.params

    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(403).json({
            error: 'Product not found'
        })
    }

    try {
        let product = await Product.findById(productId)

        if(!product){
            return res.status(403).json({
                error: 'Product not found'
            })
        }

        req.product = product // set the found category object ot req.category
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}