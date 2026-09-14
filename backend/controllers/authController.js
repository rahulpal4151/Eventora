import User from '../models/User.models.js';
import { createOtp, getOtpExpiry, hashOtp, sendVerificationOtp } from '../utils/otpMailer.js';

const issueVerificationOtp = async (user) => {
    const otp = createOtp();
    user.emailVerificationOtpHash = hashOtp(otp);
    user.emailVerificationOtpExpiresAt = getOtpExpiry();
    user.emailVerificationOtpSentAt = new Date();
    await user.save({ validateBeforeSave: false });
    await sendVerificationOtp({ email: user.email, name: user.name, otp });
};

// ==========================================
// 1. REGISTER (SIGNUP) CONTROLLER
// ==========================================
const registerUser = async (req, res) => {
    try {
        // 1. Frontend se data receive karna
        const { name, email: rawEmail, password, role } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        // 2. Validation: Koi field khali toh nahi hai?
        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"Please enter the details"});
        }
        
        // 3. Check karna ki user pehle se toh nahi hai
        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(409).json({success:false, message:"User already exist"});
        }

        // 4. Naya user database mein create karna
        // (Password hash automatically 'pre-save' hook se ho jayega jo humne User.js me likha tha)
        const user = await User.create({
            name,
            email,
            password,
            role: ['Participant', 'Organizer'].includes(role) ? role : 'Participant'
        })

        // 5. Response bhejne ke liye password hide karna
        await issueVerificationOtp(user);
        const createdUser = await User.findById(user._id).select("-password");

        res.status(201).json({
            success: true,
            message: "Account created. Check your email for the verification code.",
            requiresEmailVerification: true,
            user: createdUser
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================

const loginUser = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 1. User find karna
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // 2. Password check karna (User model ka method call karke)
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
                code: "EMAIL_NOT_VERIFIED"
            });
        }
        // 3. Tokens generate karna
        const accessToken = user.generateAccessTokenSecret();
        const refreshToken = user.generateRefreshToken();

        // 4. Refresh token ko database mein save karna
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); 
        // { validateBeforeSave: false } lagane se Mongoose poore schema ke required rules check karne mein time waste nahi karta aur jaldi save kar deta hai.
        // Is time dobara password hash nahi hoga

        // 5. Response se password aur refresh token hide karna
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        // 6. Cookies options (Security ke liye) Yeh tokens ko browser mein store karne ka sabse secure tareeka hai.
        const cookieOptions = {
            httpOnly: true, // Frontend JavaScript ise access nahi kar payegi (XSS attack se bachata hai)
            secure: process.env.NODE_ENV === 'production',   // HTTPS par hi kaam karega
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        };

        // 7. Cookies set karke response bhejna
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                success: true,
                message: "User logged in successfully",
                user: loggedInUser,
            });
    } catch (error){
        return res.status(500).json({ message: error.message});
    }
};


// Logout logic
export const logoutUser = (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

const verifyEmailOtp = async (req, res) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({ message: "Email and a 6-digit OTP are required" });
        }

        const user = await User.findOne({ email }).select('+emailVerificationOtpHash +emailVerificationOtpExpiresAt');
        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (user.isEmailVerified) {
            return res.status(200).json({ success: true, message: "Email is already verified" });
        }

        if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt || user.emailVerificationOtpExpiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (hashOtp(String(otp)) !== user.emailVerificationOtpHash) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isEmailVerified = true;
        user.emailVerificationOtpHash = undefined;
        user.emailVerificationOtpExpiresAt = undefined;
        user.emailVerificationOtpSentAt = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const resendVerificationOtp = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail?.trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email }).select('+emailVerificationOtpSentAt');
        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        if (user.emailVerificationOtpSentAt && Date.now() - user.emailVerificationOtpSentAt.getTime() < 60 * 1000) {
            return res.status(429).json({ message: "Please wait a minute before requesting another OTP" });
        }

        await issueVerificationOtp(user);
        return res.status(200).json({ success: true, message: "A new verification code has been sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export {
    registerUser,
    loginUser,
    verifyEmailOtp,
    resendVerificationOtp
}