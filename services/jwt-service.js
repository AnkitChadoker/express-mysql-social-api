const jwt = require('jsonwebtoken');
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class JWT {
    async generateTokens(payload){
        const accessToken = await jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: '1d'
        });

        const refreshToken = await jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: '1y'
        })

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token){
        return await jwt.verify(token, JWT_ACCESS_SECRET);
    }

    async verifyRefreshToken(token){
        return await jwt.verify(token, JWT_REFRESH_SECRET);
    }
}

module.exports = new JWT();