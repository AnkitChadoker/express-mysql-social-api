const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const errMsgs= errors.mapped();     
        return res.status(400).json({ 'err': errMsgs });
    }else{
        next();
    }
}

module.exports = validateRequest;