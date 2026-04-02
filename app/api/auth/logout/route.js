import { cookies } from "next/headers";
import { response, wrapRoute } from "@/lib/helper";

/**
 * Handles user logout by clearing the secure session cookie.
 */
export const POST = wrapRoute(async (req) => {
    // 1. Get current cookie store
    const cookieStore = await cookies();

    // 2. Wipe the secure session token (Clear both during transition)
    cookieStore.delete("accessToken");
    cookieStore.delete("access_token");

    // 3. Return a clean success response for the client session
    return response(true, 200, "Successfully logged out. Your secure session has been terminated.");
});
