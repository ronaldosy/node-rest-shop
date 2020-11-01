/*
 * Model for order
*/

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref:'Product', required: true }, // Define product table, by defone the relation to product_id
    quantity: { type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);