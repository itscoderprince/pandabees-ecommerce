import { connectDB } from "@/configs/db";
import { response, wrapRoute } from "@/lib/helper";
import { verifyToken } from "@/lib/token";
import User from "@/models/user.model";

/**
 * Handles email verification via JWT link.
 * 1. Decode & Verify Token -> 2. Identity Check -> 3. Update Status.
 */
export const POST = wrapRoute(async (req) => {
    await connectDB();
    const { token } = await req.json();

    if (!token) {
      return response(false, 400, "Verification token is required.");
    }

    // 1. Decode and verify the token payload
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
       return response(false, 400, "Verification link is invalid or has expired.");
    }

    // 2. Extract UserId (with legacy Buffer support)
    let userId = payload.userId;
    if (typeof userId === "object" && userId.buffer) {
      userId = Buffer.from(Object.values(userId.buffer)).toString("hex");
    }

    // 3. User Lookup
    const user = await User.findById(userId);
    if (!user) {
      return response(false, 404, "User not found. Verification failed.");
    }

    // 4. Update status if necessary
    if (user.isEmailVerified) {
      return response(true, 200, "Email is already verified!");
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Verification successful! Your account is now active.");
});
