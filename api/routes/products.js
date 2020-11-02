/*
 * Product routes
 *
*/

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Library to handle file upload
const {nanoid} = require('nanoid'); // Library to generate random id

const Product = require('../models/product') // Call product model

const router = express.Router();

// Handle GET request
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id image')
        .exec()        
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        image: '/uploads/' + doc.image,
                        request: {
                            type: 'GET',
                            url: 'http://127.0.0.1:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
});

// Define how store file in disk
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        filename = file.originalname
        extension = filename.split('.').pop(); // Get orginal file extensions
        fileId = nanoid(); // Generate random id for the upload file
        return cb(null, fileId+"."+extension);
    }
});

// Define which type of file that  can be upload
const fileFilter = function(req, file, cb){
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Handling file upload
const upload = multer({
                storage: storage, 
                limits:{fileSize: 1024 * 1024 * 2},
                fileFilter: fileFilter
            });

// Handle POST request
router.post('/',upload.single('image'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.filename
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST request to /products',
            product: {
                _id: result._id,
                name: result.name,
                price: result.price,
                image: "/uploads/" + result.image,          
                request: {
                    type: "GET",
                    url: "http://127.0.0.1:3000/products/" + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
}); 

// Handle GET request for specific product
router.get('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    Product.findById(id).exec().then( doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price, 
                    image: '/uploads/' + doc.image,
                    request: {
                        type: "GET",
                        url: "http://127.0.0.1:3000/products/" + doc._id
                    }
                }
            });
        } else {
            res.status(400).json({message: "No valid entry id"});
        }
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// Handle PATCH request (for edit product)
router.patch('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    const updateOps = {}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, { $set: updateOps }).exec().then(result => {
        res.status(200).json({
            product: {
                message: "Product id: " + id + "updated" ,
                request: {
                    type: "GET",
                    url: "http://127.0.0.1:3000/products/" + id
                }
            }
        });
    }).catch( err => {
        console.log(err);
        res.status(500).json({ error: err});
    });
});

// Handle DELETE request (delete a product)
router.delete('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    Product.remove({_id: id}).exec().then(result => {
        res.status(200).json({
            message: 'Product Deleted'
        })
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;