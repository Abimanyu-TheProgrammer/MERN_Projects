const Cart = require('../models/Cart');


exports.addItems = (req, res) => {

    Cart.findOne({user : req.user._id}).exec((error, cart) => {
        if(error) return res.status(400).json({ error })
        if(cart) {
            // console.log("cart exist")

            const product = req.body.cartItems.product
            const item = cart.cartItems.find(productObj => productObj.product == product)

            if(item) {
                // Here we have to get the cart where the product, which we want the quantity updated, in an array
                // and to do that we use the ".", as in cartItems.product. 
                Cart.findOneAndUpdate({"user" : req.user._id, "cartItems.product": product}, {
                    "$set" : {
                        "cartItems.$" : {
                    // To update a property in an object with the spread operator, put it at the end
                            ...req.body.cartItems,
                            quantity : item.quantity + req.body.cartItems.quantity
                        }
                    }
                }).exec((error, _cart) => {
                    if(error) return res.status(400).json({error})
                    if(_cart) return res.status(201).json({cart : _cart})
                })

            } else {
                Cart.findOneAndUpdate({user : req.user._id}, {
                    "$push" : {
                        "cartItems" : req.body.cartItems
                    }
                }).exec((error, _cart) => {
                    if(error) return res.status(400).json({error})
                    if(_cart) return res.status(201).json({cart : _cart})
                })
            }

        } else {

            // console.log("cart doesn't exist")
            
            const cart = new Cart({
                user : req.user._id,
                cartItems : [req.body.cartItems]
            })
            
            cart.save((error, cart) => {
                if(error) return res.status(400).json({ error })
                if(cart) return res.status(201).json({ cart })
            })
        }
    })
}