/**
 * Controller to handle any user operation
 */

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt= require('jsonwebtoken');

const User = require('../models/user')


// User signup controller
exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(user => {
            if(user.length >=1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                  res.status(201).json({
                                      message: "User Created"
                                  });
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });  
                    }
                });
            }
        });
    
}


// User login controller
exports.user_login =  (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result)=> {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if(result){
                    // Define JWT token
                    const token = jwt.sign({
                            email: user[0].email,
                            userid: user[0]._id
                        }, 
                        process.env.JWT_KEY, {
                            expiresIn: "1h" // Define token experation
                        } 
                    );
                    return res.status(200).json({
                        message: 'Auth sucessfull', 
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        });
}

// User delete controller 
exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}