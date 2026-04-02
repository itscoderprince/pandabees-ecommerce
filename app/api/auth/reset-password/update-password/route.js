import { connectDB } from "@/configs/db";
import User from "@/models/user.model";
import Otp from "@/models/Otp.model";
import { resetPasswordSchema } from "@/lib/zSchema";
import { response, wrapRoute } from "@/lib/helper";

/**
 * Step 3: Final Password Update
 * Resets the password for the given user, provided valid credentials.
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const body = await req.json();

    // 1. Validate Input (email, OTP, newPassword, confirmPassword)
    const validate = resetPasswordSchema.safeParse(body);
    if (!validate.success) {
        const error = validate.error.issues[0].message;
        return response(false, 400, error);
    }
    const { email, otp, newPassword } = validate.data;

    // 2. Locate and Verify the OTP challenge (Double check security)
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
        return response(false, 400, "Your security session has expired. Please request a new code.");
    }

    // 3. Update the User's credentials
    const user = await User.findOne({ email });
    if (!user) {
        return response(false, 404, "User account not found.");
    }

    // Update password (pre-save hook for User model handles hashing)
    user.password = newPassword;
    await user.save();

    // 4. Verification completed - Cleanup consumed OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // 5. Successful password update response delivered
    return response(true, 200, "Your password has been successfully updated. Please log in.");
});
