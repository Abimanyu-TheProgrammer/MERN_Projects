import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Layout from "../../components/Layouts";
import {addCategory, getAllCategories} from '../../actions'
import Input from '../../components/UI/Input';


/**
* @author
* @function Category
**/

const Category = (props) => {


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [categoryParentId, setCategoryParentId] = useState('');

    const categoryState = useSelector(state => state.category)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    // to show categories
    const renderCategories = (categories) => {
        
        let myCategories = []
        for(var i = 0 ; i < categories.length ; i++){
            myCategories.push(
               <li key={categories[i].name}>
                    {categories[i].name}
                    {categories[i].children.length > 0 ? (<ul>{renderCategories(categories[i].children)}</ul>) : null}
                </li>

            )
        }

        return myCategories
    }

    //for the options in the modal
    const createCategoryList = (categories, options = []) => {

        for(let category of categories){
            options.push({ value: category._id, name: category.name})
            if(category.children.length > 0)
                createCategoryList(category.children, options)
        }
        
        return options
    }

    //Handle image submissions
    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0])
    }

    //Handle form submit
    const handleSumbit = () => {
        const form = new FormData()
        form.append("name", categoryName)
        form.append("parentId", categoryParentId)
        form.append("categoryImage", categoryImage)
        dispatch(addCategory(form))
        setShow(false)
    }


  return(
    <Layout sidebar>
        <Container>
            <Row>
                <Col md={12}>
                    <div style={{"display" : "flex", "justifyContent" : "space-between"}}>
                        <h3>Category</h3>
                        <button onClick={handleShow}>Add</button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <ul>
                        {renderCategories(categoryState.categories)}
                    </ul>
                </Col>
            </Row>
        </Container>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add a New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                value = {categoryName}
                label="Category Name" 
                placeholder = "New Category" 
                type="text"
                onChange = {(e) => setCategoryName(e.target.value)}
                />

                <select className="form-control" value={categoryParentId} onChange={(e) => setCategoryParentId(e.target.value)}>
                    <option>Select Category</option>
                    {createCategoryList(categoryState.categories).map(option => 
                        <option value={option.value} key={option.value}>{option.name}</option>
                    )}
                </select>

                <input type="file" name="categoryImage" onChange={handleCategoryImage}/>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSumbit}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>

    </Layout>
   )

 }

export default Category