import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { Trash2, Trash, Link as LinkIcon, ExternalLink, Copy } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

/**
 * Media Card component for the Admin Library.
 * Displays a selectable and deletable media item.
 */
const Media = ({
    media,
    handleDelete,
    isTrashView = false, // Use direct view state for instant UI response
    selectedMedia,
    setSelectedMedia,
    index = 0,
}) => {

    // Check if current media is selected
    const isSelected = selectedMedia.includes(media._id);

    // Toggle selection status
    const toggleSelection = (checked) => {
        if (checked) {
            setSelectedMedia(prev => [...prev, media._id]);
        } else {
            setSelectedMedia(prev => prev.filter(id => id !== media._id));
        }
    };

    // Copy to clipboard handler
    const copyToClipboard = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(media.path);
        toast.success("Link copied to clipboard!");
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl hover:border-violet-400 border-border",
                isSelected 
                    ? "border-violet-600 ring-2 ring-violet-600/20 bg-violet-50/50 dark:bg-violet-950/20" 
                    : "hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
            )}>
                {/* Visual Preview */}
                <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900">
                    <Image
                        src={media.path} // High quality path
                        alt={media.alt || "Media Asset"}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        quality={100} // Increase quality to prevent blur
                        priority={index < 4} // Fix LCP warning for first few items
                    />
                </div>

                {/* Premium Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Selection UI (Top Left) */}
                <div className={cn(
                    "absolute top-3 left-3 z-20 transition-all duration-300",
                    isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )}>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={toggleSelection}
                        className="h-6 w-6 rounded-lg border-white/40 bg-black/20 backdrop-blur-md data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 shadow-lg"
                    />
                </div>

                {/* Actions (Top Right) */}
                <div className="absolute top-2 right-2 z-20 flex flex-row gap-1.5 opacity-0 translate-y-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={copyToClipboard}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xl hover:bg-violet-600 hover:border-violet-500 hover:scale-110 transition-all active:scale-95"
                            >
                                <Copy size={14} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="rounded-full px-3 text-[10px] uppercase font-bold tracking-tight">Copy Link</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href={media.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xl hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all active:scale-95"
                            >
                                <ExternalLink size={14} />
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="rounded-full px-3 text-[10px] uppercase font-bold tracking-tight">View Original</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => handleDelete(media._id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xl hover:bg-rose-600 hover:border-rose-500 hover:scale-110 transition-all active:scale-95"
                            >
                                <Trash2 size={14} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="rounded-full px-3 text-[10px] uppercase font-bold tracking-tight">
                            {isTrashView ? 'Delete Permanently' : 'Move Into Trash'}
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Media Information (Bottom) */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate text-xs font-bold text-white mb-0.5 tracking-tight drop-shadow-md">
                        {media.title || "Untitled asset"}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-[9px] uppercase font-bold tracking-widest text-white/70">
                            Enhanced
                        </span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default Media;