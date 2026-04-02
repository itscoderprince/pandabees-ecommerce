import Media from "@/models/media.model";
import { wrapRoute, response, isAuthenticated } from "@/lib/helper";
import cloudinary from "@/configs/cloudinary";
import { connectDB } from "@/configs/db";

export const POST = wrapRoute(async (request) => {
  const admin = await isAuthenticated("admin");
  if (!admin) return response(false, 401, "Admin access required");

  await connectDB();
  const body = await request.json();
  const isArray = Array.isArray(body);

  try {
    if (isArray) {
      // Bulk upload saving
      const media = await Media.insertMany(body);
      return response(true, 201, "Files saved successfully", media);
    } else {
      // Single file saving
      const media = await Media.create(body);
      return response(true, 201, "File saved successfully", media);
    }
  } catch (dbError) {
    // Rollback: Delete from Cloudinary if DB save fails
    const publicIds = isArray
      ? body.map((data) => data.public_id).filter(Boolean)
      : [body?.public_id].filter(Boolean);

    if (publicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIds);
        console.log(
          `🧹 Rolled back Cloudinary resources after DB error: ${publicIds.join(", ")}`,
        );
      } catch (cloudError) {
        console.error(
          "❌ Failed to rollback Cloudinary resources:",
          cloudError,
        );
      }
    }

    // Re-throw DB error to let wrapRoute handle the error response
    throw dbError;
  }
});

export const GET = wrapRoute(async () => {
  const admin = await isAuthenticated("admin");
  if (!admin) return response(false, 401, "Admin access required");

  await dbConnect();
  const media = await Media.find({}).sort({ createdAt: -1 });
  return response(true, 200, "Media retrieved successfully", media);
});
