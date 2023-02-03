const Mail = require('../services/mail-service');
const Otp = require('../services/otp-service');
const Bcrypt = require('../services/bcrypt-service');
const JWT = require('../services/jwt-service');

const userFactory = require('../factory/user-factory');
const UserDto = require('../dtos/user-dto');

const User = require('../models/user-model');
const RefreshToken = require('../models/refresh-token-model');

class AuthController {

    async login(req, res){
        
        const {email, password} = req.body;
        try{
            const result = await User.select({ email });
            if(result) {
                const user = result[0];
                if(!user.is_email_verified)
                    return res.status(403).json({ message: 'Please verify your email first.' });
                
                const matchPassword = await Bcrypt.compareHash(password, user.password);
                if(!matchPassword)
                    return res.status(400).json({ message: 'Invalid credentials.' });
                 
                const { accessToken, refreshToken } = await JWT.generateTokens({id: user.id}); 
                const check = await RefreshToken.select({ user_id: user.id });
                if(check.length){
                    const refreshTokenData = { token: refreshToken, updated_at: new Date() };
                    await RefreshToken.update(refreshTokenData, { user_id: user.id });
                }else{
                    const refreshTokenData = { user_id:user.id, token:refreshToken, created_at:new Date(), updated_at:new Date() };
                    await RefreshToken.insert(refreshTokenData);
                }
                // res.cookie('refreshToken', refreshToken, {
                //     maxAge: 1000 * 60 * 60 * 24 * 30,
                //     httpOnly: true,
                // });
                // res.cookie('accessToken', accessToken, {
                //     maxAge: 1000 * 60 * 60 * 24 * 30,
                //     httpOnly: true,
                // });
                return res.status(200).json({ message: "login successful", data: await userFactory(user), token: accessToken });                
            } else {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }

    async signup(req, res){        
        try {
            const user = req.body;
            const hashedPass = await Bcrypt.generate(user.password);
            const queryData = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                password: hashedPass,
                created_at: new Date(),
                updated_at: new Date()
            };
            const result = await User.insert(queryData);            
            const otp = await Otp.generate();
            const otpExpireAt = Otp.expiresAt();                
            try {                
                await Mail.userVerification(user.email, otp);                          
                await User.update({ otp, otp_expires_at: otpExpireAt, updated_at: new Date()}, { id: result.insertId });
            } catch (error) {
                // do nothing
            }        
            const userData =  await User.select({ id: result.insertId });
            const newuser = new UserDto(userData[0]);
            return res.status(200).json({ message: "registration OTP has been sent to your email address please varify.", data: newuser });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async verifyEmail(req, res){
        try {                    
            const { otp, userId } = req.body;            
            if(!userId) return res.status(400).json({ message: "userId field is required." });
            const result = await User.select({ id: userId });                
            if(!result) return res.status(404).json({ message: "No user found." })                
            const user = result[0];                
            const otpVerified = Otp.verify(otp, user);                
            if(!otpVerified.status) return res.status(400).json({ message: otpVerified.message })
            await User.update({ is_email_verified:1, otp: null, otp_expires_at:null, updated_at: new Date() }, { id: userId });            
            return res.status(200).json({ message: "email verified successfully." });
        } catch (error) {
            return res.status(500).json(error);            
        }
    }

    async resendOtp(req, res){
        try {                    
            const { email } = req.body;            
            const result = await User.select({ email });
            if(result.length > 0){
                const user = result[0];                
                if(user.is_email_verified) 
                    return res.status(400).json({ message: "your email is already verified."})
                const otp = await Otp.generate();
                const otpExpireAt = Otp.expiresAt();
                try {                                        
                    await Mail.userVerification(user.email, otp);
                    await User.update({ otp, otp_expires_at: otpExpireAt, updated_at: new Date() }, { id: user.id });
                } catch (error) {
                    // do nothing
                }
                const userData = new UserDto(user);
                return res.status(200).json({ message: "OTP has been sent to your email address please varify.", data: userData });
            }else{
                return res.status(404).json({ message: "No email address found." })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async forgotPassword(req, res){
        try{
            const { email } = req.body;
            const result = await User.select({ email });
            if(result.length > 0){                
                const user = result[0];
                const otp = await Otp.generate();
                const otpExpireAt = Otp.expiresAt();                
                try {
                    await Mail.forgotPassword(user.email, otp);
                    await User.update({ otp, otp_expires_at: otpExpireAt, updated_at: new Date() }, { id: user.id });
                } catch (error) {
                    // do nothing
                }
                const userData = new UserDto(user);
                return res.status(200).json({ message: "OTP has been sent to your email address please varify & proceed to reset password.", data: userData });
            }else{
                return res.status(404).json({ message: "No email address found." });
            }
        } catch (err) {
            return res.status(500).json(err);
        }        
    }

    async verifyOtp(req, res){
        try {
            const { otp, userId } = req.body;        
            if(!userId) return res.status(400).json({ message: "userId field is required." });
            const result = await User.select({ id: userId });            
            if(!result) return res.status(404).json({ message: "No user found." })
            const user = result[0];            
            const otpVerified = Otp.verify(otp, user);            
            if(!otpVerified.status) return res.status(400).json({ message: otpVerified.message })
            await User.update({ otp: null, otp_expires_at: null, updated_at: new Date() }, { id: userId });
            return res.status(200).json({ message: "OTP verified successfully." });
        } catch (error) {
            return res.status(500).json(error);
        }        
    }

    async resetPassword(req, res){
        try {
            const { userId, new_password } = req.body;
            if(!userId) return res.status(400).json({ message: "userId field is required."})
            const result = await User.select({ id: userId });
            if(!result) return res.status(404).json({ message: "No user found." });
            const hashedPass = await Bcrypt.generate(new_password);
            await User.update({ password: hashedPass, updated_at: new Date() }, { id: userId });            
            return res.status(200).json({ message: "password reseted successfully." });            
        } catch (error) {
            return res.status(500).json(error);
        }        
    }

    // async refresh(req, res){
    //     try {
    //         const { refreshToken: refreshTokenFromCookie } = req.cookies;
    //         const userData = await JWT.verifyRefreshToken(refreshTokenFromCookie);
    //         if(!userData) return res.status(419).json({ message: "Unauthorized request." })
    //         const result = await User.select({ id: userData.id });
    //         if(!result) return res.status(404).json({ message: "user not found" });
    //         const user = result[0];
    //         const tokenRes = await RefreshToken.select({ user_id: userData.id, token: refreshTokenFromCookie });
    //         if(!tokenRes) return res.status(419).json({ message: "Unauthorized request" });
    //         const { accessToken, refreshToken } = await JWT.generateTokens({ id: userData.id });
    //         await RefreshToken.update({ token: refreshToken }, { user_id: userData.id });

    //         res.cookie('refreshToken', refreshToken, {
    //             maxAge: 1000 * 60 * 60 * 24 * 30,
    //             httpOnly: true,
    //         });

    //         res.cookie('accessToken', accessToken, {
    //             maxAge: 1000 * 60 * 60 * 24 * 30,
    //             httpOnly: true,
    //         });

    //         const userDto = new UserDto(user);
    //         return res.status(200).json({ data: userDto, message: 'token refreshed successfully.', token: accessToken });
    //     } catch (error) {
    //         return res.status(500).json(error);
    //     }
    // }
    
    async logout(req, res){
        try {
            const { userId } = req.body.user;
            await RefreshToken.delete({ user_id: userId });
            // res.clearCookie('refreshToken');
            // res.clearCookie('accessToken');
            res.status(200).json({ message: "logout successful." });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new AuthController();