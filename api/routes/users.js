/**
 * User route
 */

const express = require('express');

const UserController = require('../controllers/users'); 

const router = express.Router();
 
router.post('/signup', UserController.user_signup);

router.post('/login',UserController.user_login);

router.delete('/:userId', UserController.user_delete );

module.exports = router;