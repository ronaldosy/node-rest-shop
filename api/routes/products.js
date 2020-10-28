const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product')

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()        
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
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

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST request to /products',
            product: {
                name: result.name,
                price: result.price,
                _id: result._id,
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

router.get('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    Product.findById(id).exec().then( doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
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