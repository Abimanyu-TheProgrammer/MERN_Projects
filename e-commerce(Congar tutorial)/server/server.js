const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')



const app = express();
require('dotenv').config({
    path:'./config/index.env'
})


// body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
// Still don't know why we're not using that here, maybe replaced with express.urlencoded

// MongoDB
const connectDB = require('./config/db');
connectDB();

// app.use(express.urlencoded() // express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(bodyParser.json())
app.use(morgan('dev')) // Get request info
app.use(cors())

//routes
const userRoute = require('./routes/auth.route');
app.use('/api/user', userRoute);
app.use('/api/category', require('./routes/category.route'));
app.use('/api/product', require('./routes/product.route'));

app.get('/', (req, res) => {
    res.send('test route => homepage')
});


app.use((req,res) => {
    res.status(404).json({
        msg : 'Page Not Found'
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})