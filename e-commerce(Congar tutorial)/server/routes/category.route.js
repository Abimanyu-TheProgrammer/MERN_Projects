const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const categoryById = require('../middleware/categoryById')
const {check, validationResult} = require('express-validator')

// @route   POST api/category
// @desc    Create Category
// @access  Private Admin
router.post('/', [
    check('name', 'Name is required').trim().not().isEmpty()

], auth ,adminAuth, async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error : errors.array()[0].msg
        })
    }

    const {name} = req.body

    try {
        let category = await Category.findOne({name})

        if(category){
            return res.status(403).json({
                error: 'Category already exists'
            })
        }

        const newCategory = new Category({ name })
        category = await newCategory.save()
        res.json(category)
    } catch (error) {
        console.lod(error)
        res.status(500).send("Server Error")
    }
})

// @route   GET api/category/all
// @desc    Get all Categories
// @access  Public
router.get('/all', async (req, res) =>{
    try{
        let data = await Category.find({})
        res.json(data);
    } catch(error){
        console.log(error)
        res.status(500).send("Server Error")
    }
})

// @route   GET api/category/:categoryId
// @desc    Get a single Category
// @access  Public

router.get('/:categoryId', categoryById, async (req, res) => {
    res.json(req.category);
})

// @route   PUT api/category/:categoryId
// @desc    Update a single Category
// @access  Private Admin
router.put('/:categoryId', auth, adminAuth, categoryById, async (req, res)=>{
    let category = req.category;
    const {name} = req.body;

    // we don't need to handle if name is undefined, it won't get overwritten.
    
    let categoryExists = await Category.findOne({name})   // check if the new category name already exists

    if(categoryExists){
        return res.status(400).json({
            error: 'Category already exists'
        })
    }

    if(name){ 
        category.name = name.trim() //trim() removes whitespace
    }
    else {
        return res.status(400).json({
            error: 'A new name for the category is required'
        })
    }

    try {
        // category = await category.save();
        res.json(category)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

router.delete('/:categoryId', auth, adminAuth, categoryById, async (req, res)=>{
    let category = req.category

    try {
        deletedCategory = await category.remove()

        res.json({
            message : `${deletedCategory.name} deleted`
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})
module.exports = router