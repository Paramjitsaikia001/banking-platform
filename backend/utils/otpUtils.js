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

// Generate OTP (This function remains the same as it generates a random 6-digit code)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
    try {
        if (!twilioClient) {
            // Development fallback - just log the OTP
            console.log(`\n🔐 [SMS OTP] Phone: ${phoneNumber} | OTP: ${otp}`);
            console.log(`📱 [SMS OTP] Use this OTP for phone verification: ${otp}\n`);
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
            console.log(`\n📧 [EMAIL OTP] Email: ${email} | OTP: ${otp}`);
            console.log(`✉️ [EMAIL OTP] Use this OTP for email verification: ${otp}\n`);
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

// *** MODIFIED: Direct comparison for OTP verification ***
const verifyOTP = (inputOtp, storedOtp) => {
    // Ensure both are strings and trim any whitespace
    return String(inputOtp).trim() === String(storedOtp).trim();
};

module.exports = {
    generateOTP,
    sendSMSOTP,
    sendEmailOTP,
    verifyOTP
};
