import { connectDB } from "@/configs/db";
import Otp from "@/models/Otp.model";
import User from "@/models/user.model";
import { forgotPasswordSchema } from "@/lib/zSchema";
import { response, wrapRoute, generateOTP } from "@/lib/helper";
import { sendEmail } from "@/configs/sendMail";
import { otpEmail } from "@/emails/otpEmail";

/**
 * Step 1: Send OTP for Password Reset (Generic)
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const body = await req.json();

    // 1. Validate Input
    const validate = forgotPasswordSchema.safeParse(body);
    if (!validate.success) {
        return response(false, 400, validate.error.issues[0].message);
    }
    const { email } = validate.data;

    // 2. Locate User
    const user = await User.findOne({ email });
    if (!user) {
        return response(false, 404, "No account found with this email address.");
    }

    // 3. Generate & Persist OTP
    const otp = generateOTP();
    await Otp.findOneAndUpdate(
        { email },
        { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
        { upsert: true, new: true }
    );

    // 4. Send Verification Email
    const emailRes = await sendEmail(
        "Reset your password",
        email,
        otpEmail(otp),
    );

    if (!emailRes.success) {
        return response(false, 500, "Failed to send verification email. Please try again.");
    }

    return response(true, 200, "Verification code sent successfully.");
});
