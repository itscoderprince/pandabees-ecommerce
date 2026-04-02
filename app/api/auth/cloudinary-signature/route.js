import { v2 as cloudinary } from "cloudinary";
import env from "@/configs/env";
import { wrapRoute, response, isAuthenticated } from "@/lib/helper";
import { NextResponse } from "next/server";

export const POST = wrapRoute(async (request) => {
  // 1. Verify administrative access
  const admin = await isAuthenticated("admin");
  if (!admin) return response(false, 401, "Admin access required");

  // 2. Extract and validate signing parameters
  const body = await request.json();
  const paramsToSign = body.paramsToSign || body.params_to_sign || body;

  if (!paramsToSign || Object.keys(paramsToSign).length === 0) {
    return NextResponse.json({ error: "No parameters to sign" }, { status: 400 });
  }

  // 3. Generate Cloudinary signature
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET,
  );

  // Note: CldUploadWidget expects the signature directly at the root of the response JSON.
  return NextResponse.json({ signature });
});
