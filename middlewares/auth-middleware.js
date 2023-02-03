const JWT =  require('../services/jwt-service');

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log(req.headers);
    try {        
        if(!authorization) throw new Error();
        const user = await JWT.verifyAccessToken(authorization);
        if(!user) throw new Error();
        req.body.user = user;
        next();
    } catch (error) {
        return res.status(419).json({ message: "Unauthorized request."})
    }
}

module.exports = auth;