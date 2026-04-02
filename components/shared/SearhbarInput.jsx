import { Search } from "lucide-react"
import { Input } from "../ui/input"

const SearchbarInput = () => {
    return (
        <div className="relative w-full max-w-[280px] md:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-4 text-muted-foreground pointer-events-none" />
            <Input
                placeholder="Search resources..."
                className="pl-10 bg-zinc-100/50 dark:bg-zinc-800/50 border-none focus-visible:ring-1 focus-visible:ring-violet-500 rounded-xl h-10 shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            />
        </div>
    )
}

export default SearchbarInput;
