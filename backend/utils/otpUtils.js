const speakeasy = require('speakeasy');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Initialize Twilio client only if credentials are available
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
}

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
    try {
        if (!twilioClient) {
            // Development fallback - just log the OTP
            console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
            return true;
        }

        await twilioClient.messages.create({
            body: `Your verification code is: ${otp}`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
};

// Send Email OTP
const sendEmailOTP = async (email, otp) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            // Development fallback - just log the OTP
            console.log(`[DEV] Email OTP for ${email}: ${otp}`);
            return true;
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${otp}`
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Verify OTP
const verifyOTP = (token, secret) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1 // Allow 30 seconds clock skew
    });
};

module.exports = {
    generateOTP,
    sendSMSOTP,
    sendEmailOTP,
    verifyOTP
}; 