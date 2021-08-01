const express = require('express')
const { createProduct } = require('../controllers/product')
const router = express.Router()
const { requiresSignin } = require('../common_middleware')
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })

const upload = multer({ storage : storage })

router.post('/product/create', requiresSignin, upload.array('productPicture'), createProduct)

module.exports = router