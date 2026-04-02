import { connectDB } from "@/configs/db";
import User from "@/models/user.model";
import Otp from "@/models/Otp.model";
import { verifyOtpSchema } from "@/lib/zSchema";
import { response, wrapRoute } from "@/lib/helper";
import { generateToken } from "@/lib/token";
import { cookies } from "next/headers";

/**
 * Handles OTP verification for final login.
 * 1. Validate Input -> 2. Find OTP -> 3. Match -> 4. Set Cookie.
 */
export const POST = wrapRoute(async (req) => {
  await connectDB();
  const body = await req.json();

  // 1. Validate Input
  const validate = verifyOtpSchema.safeParse(body);
  if (!validate.success) {
    return response(false, 400, validate.error.issues[0].message);
  }
  const { email, otp } = validate.data;

  // 2. Locate and verify the security challenge (OTP)
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    return response(
      false,
      400,
      "The verification code is incorrect or has expired.",
    );
  }

  // 3. Find and validate associated user
  const user = await User.findOne({ email });
  if (!user) {
    return response(false, 404, "Authentication failed. User not found.");
  }

  // 4. Verification successful - Cleanup
  await Otp.deleteOne({ _id: otpRecord._id });

  // 5. Generate secure session token
  const sessionToken = await generateToken(
    { 
      userId: user._id.toString(),
      role: user.role // CRITICAL: Include role for authorization checks
    },
    "7d",
  );

  // 6. Set secure session cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "accessToken",
    value: sessionToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  // 7. Success response delivers user profile
  return response(true, 200, "Login successful! Welcome back.", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});
