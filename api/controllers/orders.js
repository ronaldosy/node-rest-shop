/**
 * Controller to handle orders operation
 */

const mongoose = require('mongoose');

const Order = require('../models/order'); // Call order model
const Product = require('../models/product'); // Call product model

// Controller to list all orders
 exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product','name')
        .exec()
        .then(
            docs => {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://127.0.0.1:3000/orders/' + doc._id
                            }
                        }
                    })
                })
            }
        )
        .catch( err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

// Create new order
exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.prodId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.prodId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order saved',
                order_detail: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        });
}

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).populate('product').exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    order: {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity
                    }
                })
            } else {
                res.status(500).json({message: 'Invalid order'});
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error',
                error: err
            });
        });
}


exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                orderId: req.params.orderId
            });
        }).catch( err =>{
            res.status(500).json({
                message: 'error',
                error: err
            })
        });
    
}