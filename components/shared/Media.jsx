import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { Trash2, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Media Card component for the Admin Library.
 * Displays a selectable and deletable media item.
 */
const Media = ({ 
    media, 
    handleDelete, 
    deleteType, 
    selectedMedia, 
    setSelectedMedia 
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

    return (
        <div className={cn(
            "group relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200",
            isSelected ? "border-primary ring-1 ring-primary" : "border-muted hover:border-muted-foreground"
        )}>
            {/* Visual Preview */}
            <Image
                src={media.thumbnail_url || media.path}
                alt={media.alt || "Media Asset"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Selection Overlay */}
            <div className={cn(
                "absolute top-2 left-2 transition-opacity duration-200",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                <Checkbox 
                    checked={isSelected}
                    onCheckedChange={toggleSelection}
                    className="h-5 w-5 border-white bg-white/80 dark:bg-black/80"
                />
            </div>

            {/* Delete Actions (Single File) */}
            <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                    onClick={() => handleDelete(media._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-white shadow hover:bg-destructive"
                    title={deleteType === "PD" ? "Permanently Delete" : "Move to Trash"}
                >
                    {deleteType === "PD" ? <Trash size={14} strokeWidth={2.5}/> : <Trash2 size={14} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Title Overlay in Hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-2 text-white transition-transform duration-200 group-hover:translate-y-0">
                <p className="truncate text-xs font-medium">{media.title}</p>
            </div>
        </div>
    );
};

export default Media;