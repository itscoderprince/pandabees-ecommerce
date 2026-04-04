import { connectDB } from "@/configs/db";
import { isAuthenticated, response, wrapRoute } from "@/lib/helper";
import Media from "@/models/media.model";
import cloudinary from "@/configs/cloudinary";

/**
 * Permanent Delete Route: Erases from Cloudinary storage AND MongoDB
 */
export const DELETE = wrapRoute(async (req) => {
    const admin = await isAuthenticated("admin");
    if (!admin) return response(false, 401, "Admin access required");

    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return response(false, 400, "Media IDs are required for purge");
    }

    try {
        // Find documents to get their public_ids for Cloudinary deletion
        const itemsToPurge = await Media.find({ _id: { $in: ids } });
        const publicIds = itemsToPurge
            .map((item) => item.public_id)
            .filter((pid) => pid);

        // 1. Delete from Cloudinary if there are any public IDs
        if (publicIds.length > 0) {
            // Using bulk deletion from Cloudinary (max 100 per call, which covers usual bulk selections)
            await cloudinary.api.delete_resources(publicIds);
        }

        // 2. Delete from MongoDB
        const result = await Media.deleteMany({ _id: { $in: ids } });

        return response(true, 200, `Successfully purged ${result.deletedCount} assets permanently`, { result });
    } catch (error) {
        console.error("Critical Permanent Delete Error:", error);
        return response(false, 500, "Deletion failed during Cloudinary synchronization");
    }
});

/**
 * Soft Delete / Restore Route: Toggles the deletedAt timestamp
 */
export const PUT = wrapRoute(async (req) => {
    const admin = await isAuthenticated("admin");
    if (!admin) return response(false, 401, "Admin access required");

    await connectDB();
    const { ids, deleteType } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return response(false, 400, "Media IDs are required for this action");
    }

    // "SD" means Soft Delete (Move to Trash)
    if (deleteType === "SD") {
        const result = await Media.updateMany(
            { _id: { $in: ids } },
            { $set: { deletedAt: new Date() } }
        );
        return response(true, 200, "Moved items to trash library", { result });
    }

    // "RS" for Restore (Move back to Library)
    if (deleteType === "RS") {
        const result = await Media.updateMany(
            { _id: { $in: ids } },
            { $set: { deletedAt: null } }
        );
        return response(true, 200, "Restored items to main library", { result });
    }

    return response(false, 400, "Invalid operation type specified");
});
