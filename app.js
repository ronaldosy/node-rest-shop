/* 
 * Entry point to the application
*/

const express = require('express');
const morgan = require('morgan');           // morgan used for http logger
const bodyParser = require('body-parser');  // body-parser used to parse body request 
const mongoose = require('mongoose');       // Library for connecting to MongoDB

const app = express(); // initiate express 

const prodRoute = require('./api/routes/products'); // Initiate products
const orderRoute = require('./api/routes/orders');  // Initiate orders

// Initiate connection to MongoDB
mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PWD + '@cluster0.zuyot.mongodb.net/nodeshop?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
});

app.use(morgan('dev')); // Initiate morgan
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false})); // Enable body-parser to parse url request
app.use(bodyParser.json()); // Enable body-parser to parse json request

// Define HTTP header for response
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', prodRoute); // Map Product router
app.use('/orders', orderRoute); // Map Order router

// Define 404 response
app.use((req, res, next) => {
    const error = new Error('Resource Not Found');
    error.status = 404;
    next(error);
});

// Define other error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;