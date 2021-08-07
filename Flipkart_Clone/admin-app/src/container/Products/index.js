import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layouts'
import { Col, Container, Row, Modal, Button, Table } from 'react-bootstrap';
import Input from '../../components/UI/Input';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../actions'

/**
* @author
* @function Products
**/

const Products = (props) => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [productPictures, setProductPictures] = useState([])
  
  const productState = useSelector(state => state.product)
  const categoryState = useSelector(state => state.category)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllCategories())
  }, [])

  const handleClose = () => {
    setName('')
    setPrice('')
    setQuantity('')
    setDescription('')
    setCategoryId('')
    setProductPictures([])
    setShow(false);
  }

  const handleShow = () => setShow(true);

  //Handle form submit
  const handleSumbit = () => {

    setShow(false)
  }

  //for the options in the modal
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name })
      if (category.children.length > 0)
        createCategoryList(category.children, options)
    }

    return options
  }

  const handleProductPictures = (e) => {
    setProductPictures([
      ...productPictures,
      e.target.files[0]
    ])
  }

  const renderProducts = () => {
    return (
      <Table responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
            {
              productState.products.length > 0 ? 
              productState.products.map(product => 
              <tr key = {product._id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
              </tr>
              ) : null
            } 
            
        </tbody>
      </Table>
    );
  }

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
              <h3>Products</h3>
              <button onClick={handleShow}>Add</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {renderProducts()}
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            value={name}
            label="Product Name"
            placeholder="New Product Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            value={quantity}
            label="Product Quantity"
            placeholder="Product quantity..."
            type="text"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Input
            value={description}
            label="Product Description"
            placeholder="Anything to add about the product"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            value={price}
            label="Product Price"
            placeholder="Price of product"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
          />

          <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option>Select Category</option>
            {createCategoryList(categoryState.categories).map(option =>
              <option value={option.value} key={option.value}>{option.name}</option>
            )}
          </select>

          {
            productPictures.length > 0 ? (
              productPictures.map((picture, index) => <div key={index}>{picture.name}</div>)
            ) : null
          }

          <input type="file" name="productPictures" onChange={handleProductPictures} />
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

export default Products
