import { categoryConstants } from "../actions/constants";

const initState = {
    loading : false,
    categories : [],
    error : null

};

const buildNewCategories = (parentId, categories, newCategory) => {
    let categoryList = []
    
    for (let category of categories){
        if(category._id === parentId){
            categoryList.push({
                ...category,
                children : ( category.children && category.children.length > 0 ) ? buildNewCategories(parentId, [...category.children, {
                    _id : newCategory._id,
                    name : newCategory.name,
                    parentId : newCategory.parentId,
                    slug : newCategory.slug,
                    children : newCategory.children
                }], newCategory) : {
                    _id : newCategory._id,
                    name : newCategory.name,
                    parentId : newCategory.parentId,
                    slug : newCategory.slug,
                    children : newCategory.children
                }
            })
        } else {
            categoryList.push({
                ...category,
                children : ( category.children && category.children.length > 0 ) ? buildNewCategories(parentId, category.children, newCategory) : []
            })
        }
    }

    return categoryList;
}

const categoryReducer = (state = initState , action) => {
    
    switch(action.type){
        case categoryConstants.GET_ALL_CATEGORIES_REQUEST:
            state = {
                ...state,
                loading : true
            }
            break;

        case categoryConstants.GET_ALL_CATEGORIES_SUCCESS:
            state = {
                ...state,
                loading : false,
                categories : action.payload.categories
            }
            break;
            
        case categoryConstants.GET_ALL_CATEGORIES_FAILURE:
            state = {
                ...state,
                loading : false,
                error : action.payload.error
            }
            break;

        case categoryConstants.ADD_NEW_CATEGORY_REQUEST: 
            state = {
                ...state,
                loading : true
            }
            break;

        case categoryConstants.ADD_NEW_CATEGORY_SUCCESS:
            const newCategories = buildNewCategories(action.payload.category.parentId, state.categories, action.payload.category)

            state = {
                ...state,
                loading : false,
                categories : newCategories
            }
            break;    

        case categoryConstants.ADD_NEW_CATEGORY_FAILURE:
            state = {
                ...initState
            }
            break;

        default :
            break;
    }

    return state;
}

export default categoryReducer