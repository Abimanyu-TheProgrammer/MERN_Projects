const express = require('express')
const { requiresSignin, adminMiddleware } = require('../common_middleware')
const { createCategory, getCategories } = require('../controllers/category')
const router = express.Router()
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


router.post('/category/create', requiresSignin, adminMiddleware,  upload.single('categoryImage'), createCategory)
router.get('/category/list', getCategories)

module.exports = router