const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
  }
});

class Mail {
    async sendMail(mailOptions){
      await transporter.sendMail(mailOptions);
    }

    async userVerification(to, otp){
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to,
            subject: 'Verification Mail.',
            html: `Your socialAuth OTP is <b>${otp}</b>, hurry its only valid for 2 minutes.`
        };
        return await this.sendMail(mailOptions)
    }
    
    async forgotPassword(to, otp){
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to,
            subject: 'Forgot password request mail.',
            html: `Your socialAuth OTP is <b>${otp}</b>, hurry its only valid for 2 minutes, verify the otp and proceed to reset the password.`
        };
        return await this.sendMail(mailOptions)
    }
}

module.exports = new Mail();