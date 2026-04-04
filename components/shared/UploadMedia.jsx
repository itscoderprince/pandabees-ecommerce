'use client'

import React, { useMemo, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { toast } from "sonner";

import env from "@/configs/env";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

// Move static configuration outside to prevent unnecessary re-renders
const WIDGET_STYLES = {
    palette: {
        window: "#FFFFFF",
        windowBorder: "#E4E4E7",
        tabIcon: "#000000",
        menuIcons: "#52525B",
        textDark: "#000000",
        textLight: "#FFFFFF",
        link: "#000000",
        action: "#18181B",
        inactiveTabIcon: "#A1A1AA",
        error: "#EF4444",
        inProgress: "#3B82F6",
        complete: "#10B981",
        sourceBg: "#FFFFFF"
    }
};

const WIDGET_SOURCES = ['local', 'url', 'unsplash', 'google_drive', 'dropbox', 'shutterstock'];

/**
 * UploadMedia - Optimized Cloudinary upload component.
 * Uses memoized callbacks and static configuration for high performance.
 */
const UploadMedia = ({ isMultiple = true }) => {

    // Memoized error handler
    const onError = useCallback((error) => {
        console.error("Cloudinary upload error:", error);
        toast.error("Media upload failed. Check your connection.");
    }, []);

    // Optimized handler for saving Cloudinary metadata to Database
    const onQueuesEnd = useCallback(async (result) => {
        const files = result?.info?.files;
        if (!files?.length) return;

        try {
            // Map results efficiently
            const mediaToSave = files
                .filter(file => file.uploadInfo)
                .map(file => {
                    const info = file.uploadInfo;
                    return {
                        asset_id: info.asset_id,
                        public_id: info.public_id,
                        path: info.secure_url,
                        thumbnail_url: info.thumbnail_url || info.secure_url,
                        alt: info.original_filename || "Untitled Media",
                        title: info.original_filename || "Untitled Media",
                    };
                });

            if (mediaToSave.length > 0) {
                const { data } = await axios.post("/api/media/create", mediaToSave);
                if (data.success) {
                    toast.success(`${mediaToSave.length} file(s) indexed successfully.`);
                } else {
                    toast.error(data.message || "Metadata sync failed.");
                }
            }
        } catch (error) {
            console.error("Critical: Metadata sync failed:", error);
            toast.error("Upload complete but failed to save to Database.");
        }
    }, []);

    // Memoize options to prevent stable property shifts
    const widgetOptions = useMemo(() => ({
        multiple: isMultiple,
        sources: WIDGET_SOURCES,
        styles: WIDGET_STYLES
    }), [isMultiple]);

    const cloudConfig = useMemo(() => ({
        cloud: {
            cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: env.NEXT_PUBLIC_CLOUDINARY_API_KEY
        }
    }), []);

    return (
        <CldUploadWidget
            uploadPreset={env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            signatureEndpoint="/api/auth/cloudinary-signature"
            onQueuesEnd={onQueuesEnd}
            onError={onError}
            config={cloudConfig}
            options={widgetOptions}
        >
            {({ open }) => (
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        open?.();
                    }}
                    className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all active:scale-95 gap-2"
                >
                    <UploadCloud className="h-4 w-4" strokeWidth={2} />
                    <span className="font-bold text-sm">Upload</span>
                </Button>
            )}
        </CldUploadWidget>
    );
};

export default React.memo(UploadMedia);
