"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Search, Filter, X, Image as ImageIcon, Trash, Trash2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import UploadMedia from "@/components/shared/UploadMedia";
import Media from "@/components/shared/Media";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/routes/Admin.Route";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import useDeleteMutation from "@/hooks/useDeleteMutation";

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState("SD");
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const queryClient = useQueryClient();


    const searchParams = useSearchParams();
    const isTrashView = searchParams.get("trashof") === "media";

    // Sync deleteType with view state
    useEffect(() => {
        setDeleteType(isTrashView ? "PD" : "SD");
    }, [isTrashView]);


    /**
     * API: Fetch media assets with pagination
     */
    const fetchMedia = async (page, deleteType) => {
        const { data } = await axios.get(
            `/api/media?page=${page}&limit=13&deleteType=${deleteType}`,
        );
        return data;
    };

    /**
     * Infinite Query configuration
     * Query Key includes deleteType to ensure cache is segregated between library and trash.
     */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["media-data", deleteType],
        queryFn: ({ pageParam = 1 }) => fetchMedia(pageParam, deleteType),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            // Safely extract next page from API response
            return lastPage?.pagination?.nextPage ?? undefined;
        },
    });

    /**
     * Delete Mutation: Integrated from custom hook
     */
    const deleteMutation = useDeleteMutation(["media-data"], "/api/media/delete", {
        onSuccess: () => {
            setSelectedMedia([]);
        }
    });

    const handleDelete = (ids) => {
        const confirmMsg = isTrashView
            ? "Files will be permanently erased. Proceed?"
            : "Move these items to trash?";

        if (!window.confirm(confirmMsg)) return;

        deleteMutation.mutate({ ids, deleteType });
    };

    /** 
     * NEW FEATURES: Selection & Trash Management
     * We use simple arrays and standard JS methods to keep it clean.
     */

    // 1. Get all loaded IDs to allow "Select All"
    const allLoadedMediaIds = data?.pages.flatMap(page => page.mediaData.map(m => m._id)) || [];
    const isAllSelected = allLoadedMediaIds.length > 0 && selectedMedia.length === allLoadedMediaIds.length;

    // 2. Logic to toggle selecting everything
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedMedia(allLoadedMediaIds);
        } else {
            setSelectedMedia([]);
        }
    };

    // 3. Logic to handle "Restore" from Trash
    const handleRestore = (ids) => {
        deleteMutation.mutate({ ids, deleteType: "RS" });
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Header Section - Branded & Informative */}
            <div className="flex items-center justify-between w-full gap-8">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-2.5 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300",
                        isTrashView
                            ? "bg-rose-600 text-white shadow-rose-200 dark:shadow-rose-900/20"
                            : "bg-violet-600 text-white shadow-violet-200 dark:shadow-violet-900/20"
                    )}>
                        {isTrashView ? <Trash className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-foreground transition-none animate-in fade-in slide-in-from-left-2 duration-300">
                            {isTrashView ? "Trash Bin" : "Media Library"}
                        </h1>
                        <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-70 animate-in fade-in slide-in-from-left-4 duration-500">
                            {isTrashView
                                ? "Review discarded assets. Items can be restored or erased."
                                : "Organize and manage your digital visual experiences."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-0 bg-transparent">
                    {/* Minimalist Search Area */}
                    <div className={cn(
                        "flex items-center transition-all duration-500 ease-in-out px-1",
                        isSearchOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden"
                    )}>
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                            <Input
                                placeholder="Find assets..."
                                className="h-9 pl-9 border-zinc-200 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500 text-xs font-semibold rounded-xl shadow-sm placeholder:text-muted-foreground/60 transition-all text-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-violet-100/50 hover:text-violet-600 transition-all shadow-none"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                    </Button>

                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-none">
                        <Filter className="h-4 w-4" />
                    </Button>

                    <div className="h-6 w-[1px] bg-border mx-1" />

                    {/* Robust Theme-Reactive View Switcher */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            asChild
                            className={cn(
                                "h-9 px-4 rounded-xl font-bold gap-2 transition-all duration-200 border flex items-center justify-center shadow-sm",
                                isTrashView
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                                    : "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300"
                            )}
                        >
                            <Link href={isTrashView ? ADMIN_ROUTES.MEIDA : `${ADMIN_ROUTES.MEIDA}?trashof=media`}>
                                {isTrashView ? (
                                    <>
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="whitespace-nowrap">Media View</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="whitespace-nowrap">Trash Bin</span>
                                    </>
                                )}
                            </Link>
                        </Button>
                    </div>

                    {/* Action: Upload (Only for Library) */}
                    {!isTrashView && <UploadMedia />}

                    {/* Feature: Minimalism Selection Action Pill (Highest Contrast) */}
                    {selectedMedia.length > 0 && (
                        <div className="flex items-center gap-1 p-0.5 pl-3 pr-1 bg-zinc-900 dark:bg-zinc-950 rounded-full animate-in slide-in-from-right-3 duration-300 shadow-2xl ml-1 border border-zinc-800/20">
                            {/* Toggle ALL inside the pill */}
                            <div
                                className="flex items-center gap-2 px-2 hover:bg-white/10 rounded-full cursor-pointer h-7 transition-colors"
                                onClick={() => handleSelectAll(!isAllSelected)}
                            >
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    className="h-3 w-3 bg-transparent border-white/40 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                                />
                                <span className="text-[9px] font-black text-white tracking-widest uppercase">ALL</span>
                            </div>

                            <div className="h-4 w-[1px] bg-white/20 mx-1" />

                            {isTrashView ? (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => handleRestore(selectedMedia)}
                                        className="h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] px-3 gap-1"
                                    >
                                        <RotateCcw className="h-3 w-3" /> RESTORE
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(selectedMedia)}
                                        className="h-7 rounded-full font-bold text-[9px] px-3 gap-1"
                                    >
                                        <Trash2 className="h-3 w-3" /> PURGE
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selectedMedia)}
                                    className="h-7 rounded-full font-bold text-[9px] px-4 gap-1.5"
                                >
                                    <Trash className="h-3 w-3" /> TRASH
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area - Full Width & Dense Grid */}
            <div className="relative min-h-[85vh] rounded-2xl border bg-slate-50/20 dark:bg-slate-950/20 transition-all duration-500">
                {status === "pending" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-700">
                        <div className="relative flex items-center justify-center pt-20">
                            {/* Professional Loader with Pulsing Background */}
                            <div className="absolute h-24 w-24 bg-violet-500/10 rounded-full animate-pulse blur-xl" />
                            <Loader2 className="h-12 w-12 animate-spin text-violet-600 transition-all" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm font-semibold tracking-wide text-foreground uppercase opacity-80">Loading Assets</p>
                            <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-violet-600 animate-loading-bar" />
                            </div>
                        </div>
                    </div>
                ) : status === "error" ? (
                    <div className="flex min-h-[400px] w-full flex-col items-center justify-center text-center p-12">
                        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">Failed to load media</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Something went wrong while fetching your visual library.</p>
                        <Button variant="outline" className="mt-8 px-8 rounded-full" onClick={() => queryClient.invalidateQueries(["media-data"])}>
                            Retry connection
                        </Button>
                    </div>
                ) : (
                    <div className="p-4 md:p-6 transition-all animate-in fade-in zoom-in-95 duration-500">
                        {/* Media Grid */}
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {data?.pages?.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page?.mediaData?.map((media, itemIndex) => (
                                        <Media
                                            key={media._id}
                                            index={pageIndex * 13 + itemIndex}
                                            media={media}
                                            isTrashView={isTrashView} // Zero-lag Direct Propagation
                                            handleDelete={handleDelete}
                                            selectedMedia={selectedMedia}
                                            setSelectedMedia={setSelectedMedia}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Load More Button - Distinct Professional Outline Version */}
                        {hasNextPage && (
                            <div className="flex justify-center pt-12 pb-8">
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    variant="outline"
                                    className="min-h-12 px-10 rounded-full border-2 border-violet-100 hover:border-violet-600 hover:bg-violet-50 text-violet-600 font-bold shadow-sm transition-all duration-300 group"
                                >
                                    {isFetchingNextPage ? (
                                        <Loader2 className="animate-spin mr-3 h-5 w-5" />
                                    ) : null}
                                    <span className="group-active:scale-95 transition-transform">
                                        {isFetchingNextPage ? "Synchronizing Asset Library..." : "Show More Assets"}
                                    </span>
                                </Button>
                            </div>
                        )}

                        {data?.pages[0]?.mediaData.length === 0 && (
                            <div className="flex h-[400px] flex-col items-center justify-center text-center">
                                <Search className="h-12 w-12 text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold">Your library is quiet</h3>
                                <p className="text-muted-foreground mt-2">Start uploading to see your assets here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaPage;
