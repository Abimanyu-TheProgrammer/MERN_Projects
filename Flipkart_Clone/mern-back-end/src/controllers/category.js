const Category = require('../models/Category')
const { default: slugify } = require('slugify')



function createCategories(categories, parentId = null){
    const categoryList = [];
    let category;

    if(parentId == null){
       category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id : cate._id,
            name : cate.name,
            slug : cate.slug,
            parentId : cate.parentId,
            children : createCategories(categories, cate._id)
        })
    }
        return categoryList

}


exports.createCategory = (req, res) => {

    const categoryObj = {
        name : req.body.name,
        slug : slugify(req.body.name),
    }

    const categoryImage = req.file

    if(categoryImage) {

        if(categoryImage.mimetype !== 'image/jpeg' && categoryImage.mimetype !== 'image/jpg' && categoryImage.mimetype !== 'image/png') 
            return res.status(400).json({
                message: "Image type not allowed"
            })

        categoryObj.categoryImage = process.env.API + '/public/' + req.file.filename
        
    }


    if(req.body.parentId) categoryObj.parentId = req.body.parentId

    const newCategory = new Category(categoryObj)

    newCategory.save((error, category) => {
        if(error) return res.status(400).json({ error })
        if(category){
            return res.status(201).json({ category })
        }
    })
}

exports.getCategories = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if(error) return res.status(400).json({error})

        if(categories) {
            const categoryList = createCategories(categories);
            return res.status(200).json({categoryList})
        }
    })
}