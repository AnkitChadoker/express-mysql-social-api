const bcrypt = require('bcrypt');

class Bcrypt {

    async generate(data){
        const salt = await bcrypt.genSalt(10);
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;
    }

    async compareHash(data, encrypted){
        return await bcrypt.compare(data, encrypted);
    }

}

module.exports = new Bcrypt();