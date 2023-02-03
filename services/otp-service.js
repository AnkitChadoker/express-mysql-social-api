const crypto = require('crypto');

class Otp {
    async generate(){
        const otp = await crypto.randomInt(1000, 9999);
        return otp;
    }

    expiresAt(){
        const currentTime = new Date(); 
        const otpExpireAt = currentTime.setMinutes(currentTime.getMinutes() + 2);
        return new Date(otpExpireAt);
    }

    verify(otp, user){
        if(otp == user.otp){
            if(user.otp_expires_at < new Date())
                return { status: false, message: "OTP expired." };
            return { status: true, message: "OTP verified." };
        }else{
            return { status: false, message: "Invalid OTP." };            
        }        
    }
}

module.exports = new Otp();