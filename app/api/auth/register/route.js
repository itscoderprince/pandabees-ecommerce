import { connectDB } from "@/configs/db";
import User from "@/models/user.model";
import { registerSchema } from "@/lib/zSchema";
import { response, wrapRoute } from "@/lib/helper";
import env from "@/configs/env";
import { generateToken } from "@/lib/token";
import { sendEmail } from "@/configs/sendMail";
import { emailVerificationLink } from "@/emails/emailVerification";

/**
 * Handles new user registration.
 * 1. Validate Input -> 2. Duplicate Check -> 3. Create User -> 4. Send Email.
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const body = await req.json();

    // 1. Validate request payload
    const validate = registerSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { name, email, password } = validate.data;

    // 2. Prevent duplicate accounts
    const existingUser = await User.exists({ email });
    if (existingUser) {
      return response(false, 400, "An account already exists with this email.");
    }

    // 3. Create the user profile
    const newUser = await User.create({ name, email, password });

    // 4. Generate activation token
    const token = await generateToken({ userId: newUser._id.toString() });

    // 5. Deliver verification email
    const link = `${env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${token}`;
    const emailRes = await sendEmail(
        "Verify your PandaBees account",
        email,
        emailVerificationLink(link),
    );

    // Return success response even if email fails (user is created)
    if (!emailRes.success) {
      return response(true, 201, "Registration successful, but email delivery failed. Please contact support.", {
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        emailStatus: "failed"
      });
    }

    return response(true, 201, "Welcome! Please check your inbox to verify your account.", {
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      emailStatus: "sent"
    });
});
