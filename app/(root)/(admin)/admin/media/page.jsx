"use client";

import React, { useState } from "react";
import axios from "axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UploadMedia from "@/components/shared/UploadMedia";
import Media from "@/components/shared/Media";
import UIButton from "@/components/shared/UIButton";

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState("SD");
    const [selectedMedia, setSelectedMedia] = useState([]);
    const queryClient = useQueryClient();

    /**
     * API: Fetch media assets with pagination
     */
    const fetchMedia = async (page, deleteType) => {
        const { data } = await axios.get(
            `/api/media?page=${page}&limit=12&deleteType=${deleteType}`,
        );
        return data;
    };

    /**
     * Infinite Query configuration
     */
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["media-data", deleteType],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage.hasMore ? nextPage : undefined;
        },
    });

    /**
     * Handle single or bulk deletion logic
     */
    const handleDelete = async (ids) => {
        if (!confirm("Are you sure you want to delete this media?")) return;
        
        try {
            const targets = Array.isArray(ids) ? ids : [ids];
            // Placeholder: Assume an API exists or will be implemented for deletion
            // await axios.delete('/api/media', { data: { ids: targets, type: deleteType } });
            
            toast.success("Delete logic triggered (API implementation pending)");
            queryClient.invalidateQueries(["media-data"]);
            setSelectedMedia([]);
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    return (
        <Card className="min-h-[80vh] shadow-sm">
            <CardHeader className="border-b px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Media Library</h1>
                        <p className="text-sm text-muted-foreground">Manage your digital assets and uploads here.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Bulk Actions UI */}
                        {selectedMedia.length > 0 && (
                            <UIButton 
                                onClick={() => handleDelete(selectedMedia)}
                                className="bg-destructive hover:bg-destructive/90 text-white gap-2"
                            >
                                <Trash2 size={16} />
                                Delete ({selectedMedia.length})
                            </UIButton>
                        )}
                        <UploadMedia />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {status === "pending" ? (
                    <div className="flex h-64 w-full flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-sm text-muted-foreground font-medium">Indexing your assets...</p>
                    </div>
                ) : status === "error" ? (
                    <div className="flex h-64 items-center justify-center text-destructive font-medium">
                        {error.message}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Media Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                            {data?.pages?.map((page, index) => (
                                <React.Fragment key={index}>
                                    {page?.mediaData?.map((media) => (
                                        <Media 
                                            key={media._id}
                                            media={media}
                                            deleteType={deleteType}
                                            handleDelete={handleDelete}
                                            selectedMedia={selectedMedia}
                                            setSelectedMedia={setSelectedMedia}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Load More Trigger */}
                        {hasNextPage && (
                            <div className="flex justify-center pt-4">
                                <UIButton
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    variant="outline"
                                    className="px-8"
                                >
                                    {isFetchingNextPage ? (
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                    ) : null}
                                    Load More Assets
                                </UIButton>
                            </div>
                        )}

                        {/* Blank Slate state */}
                        {data?.pages[0]?.mediaData.length === 0 && (
                            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                                <span className="text-4xl">📁</span>
                                <h3 className="text-lg font-semibold">No assets found</h3>
                                <p className="text-sm text-muted-foreground">Start by uploading some media to your library.</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MediaPage;
