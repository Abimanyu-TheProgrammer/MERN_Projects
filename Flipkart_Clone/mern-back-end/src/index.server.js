const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')


// Environment Variables
require('dotenv').config({
    path : ".env"
})
app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname,"uploads")))
app.use(morgan('dev'))

// Routes
app.use('/api', require('./routes/auth')) // user routes
app.use('/api', require('./routes/admin/auth')) // admin routes
app.use('/api', require('./routes/category')) // category routes
app.use('/api', require('./routes/product')) // product routes
app.use('/api', require('./routes/cart')) // cart routes 
app.use('/api', require("./routes/admin/initialData")) // Initial Data route

app.use((req, res) => {
    return res.status(404).json({
        message : "Page not found"
    })
})

//Mongodb connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(console.log("Database Connected"))


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}!`);
});