/**
 * Product routes
 */

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Library to handle file upload
const {nanoid} = require('nanoid'); // Library to generate random id

const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const router = express.Router();

// Handle GET request
router.get('/', ProductController.product_get_all);

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
router.post('/', checkAuth, upload.single('image'), ProductController.products_add_product ); 

// Handle GET request for specific product
router.get('/:prodId', ProductController.products_get_product);

// Handle PATCH request (for edit product)
router.patch('/:prodId', checkAuth, );

// Handle DELETE request (delete a product)
router.delete('/:prodId', checkAuth, ProductController.products_delete_product);

module.exports = router;