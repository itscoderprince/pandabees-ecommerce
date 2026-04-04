import { connectDB } from "@/configs/db";
import { isAuthenticated, response, wrapRoute } from "@/lib/helper";
import Media from "@/models/media.model";
import { NextResponse } from "next/server";

export const GET = wrapRoute(async (req) => {
  const admin = await isAuthenticated("admin");
  console.log(admin);
  if (!admin) return response(false, 401, "Admin access required");

  await connectDB();

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const limit = parseInt(searchParams.get("limit"), 10) || 12;
  const deleteType = searchParams.get("deleteType"); // String ("SD" or "PD")

  let filter = {};
  if (deleteType === "SD") {
    filter = { deletedAt: null };
  } else if (deleteType === "PD") {
    filter = { deletedAt: { $ne: null } };
  }

  const mediaData = await Media.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const totalMedia = await Media.countDocuments(filter);

  return NextResponse.json({
    mediaData: mediaData,
    pagination: {
      total: totalMedia,
      nextPage: (page * limit) < totalMedia ? page + 1 : undefined,
    },
  });
});
