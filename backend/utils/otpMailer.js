import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const OTP_EXPIRY_MINUTES = 10;

export const createOtp = () => String(crypto.randomInt(100000, 1000000));

export const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const getOtpExpiry = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const createTransporter = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.');
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD.replace(/\s/g, '')
        }
    });
};

export const sendVerificationOtp = async ({ email, name, otp }) => {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Verify your Eventora account',
        text: `Hi ${name}, your Eventora verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `<p>Hi ${name},</p><p>Your Eventora verification code is:</p><h2>${otp}</h2><p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`
    });
};
