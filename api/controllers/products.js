/**
 * Controller to handle all product operation
 */

const mongoose = require('mongoose');

const Product = require('../models/product') // Call product model

// Get all product
exports.product_get_all =  (req, res, next) => {
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
}

// Add new Product
exports.products_add_product = (req, res, next) => {
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
    
}

// Get single product 
exports.products_get_product = (req, res, next) => {
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
}

// Edit a product 
exports.products_edit_product = (req, res, next) => {
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
}

// Delete a product
exports.products_delete_product = (req, res, next) => {
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
}