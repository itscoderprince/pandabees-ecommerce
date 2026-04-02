import { connectDB } from "@/configs/db";
import User from "@/models/user.model";
import Otp from "@/models/Otp.model";
import { loginSchema } from "@/lib/zSchema";
import { response, wrapRoute, generateOTP } from "@/lib/helper";
import { sendEmail } from "@/configs/sendMail";
import { emailVerificationLink } from "@/emails/emailVerification";
import { otpEmail } from "@/emails/otpEmail";
import { generateToken } from "@/lib/token";
import env from "@/configs/env";

/**
 * Handles user login with two-phase security.
 * 1. Validation & Credential check.
 * 2. Unverified user check & activation resend.
 * 3. Security challenge (OTP) generation and delivery.
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const body = await req.json();
    
    // 1. Initial Identity & Request Type Check

    const { email, password, resend } = body;

    // 2. Locate User (needed for both flows)
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
        return response(false, 404, "No account found with this email address.");
    }

    // 3. Handle OTP Resend Request
    if (resend) {
        // Clear all previous OTPs and generate a fresh one
        await Otp.deleteMany({ email });
        const otp = generateOTP();
        await new Otp({ email, otp }).save();

        const emailRes = await sendEmail("New verification code", email, otpEmail(otp));
        if (!emailRes.success) return response(false, 500, "Email delivery failed.");
        
        return response(true, 200, "A fresh security code has been sent to your email.");
    }

    // 4. Standard Login Validation (Phase 1)
    const validate = loginSchema.safeParse(body);
    if (!validate.success) {
        return response(false, 400, validate.error.issues[0].message);
    }

    // 5. Activation Check (Account must be verified)
    if (!user.isEmailVerified) {
        const verifyToken = await generateToken({ userId: user._id.toString() });
        const verifyLink = `${env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${verifyToken}`;
        await sendEmail("Verify your account", email, emailVerificationLink(verifyLink));
        
        return response(false, 403, "Account not active. A new verification link has been sent.");
    }

    // 6. Security Check (Password Verification)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return response(false, 401, "The credentials you entered are incorrect.");
    }

    // 7. Security Challenge Issuance (OTP Phase 2 Transition)
    await Otp.deleteMany({ email });
    const otp = generateOTP();
    await new Otp({ email, otp }).save();

    const otpRes = await sendEmail("Your PandaBees login code", email, otpEmail(otp));
    if (!otpRes.success) return response(false, 500, "Unable to deliver security code.");

    return response(true, 200, "Device verification required. Code sent to inbox.");
});

