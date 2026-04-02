import { connectDB } from "@/configs/db";
import Otp from "@/models/Otp.model";
import User from "@/models/user.model";
import { verifyOtpSchema } from "@/lib/zSchema";
import { response, wrapRoute } from "@/lib/helper";

/**
 * Step 2: Verify Reset Password OTP
 * Confirms the user has access to their email.
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const body = await req.json();

    // 1. Validate Input (email and otp)
    const validate = verifyOtpSchema.safeParse(body);
    if (!validate.success) {
        return response(false, 400, validate.error.issues[0].message);
    }
    const { email, otp } = validate.data;

    // 2. Locate OTP from database
    const otpRecord = await Otp.findOne({ email, otp });
    
    // 3. Validation result
    if (!otpRecord) {
        return response(false, 400, "The verification code is incorrect or has expired.");
    }

    // 4. Verification result confirmed - Redirect user to "Update Password" phase
    return response(true, 200, "Code verified successfully.");
});
