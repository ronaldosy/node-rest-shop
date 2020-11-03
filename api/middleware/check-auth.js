const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Get the token that store in Authorization headers
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the token
        req.userData = decoded;
        next();
    }catch (error){
        return res.status(401).json({
            message: 'Not login'
        });
    }
    

}