import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/shared/DynamicBreadcrumb";
import { SearchCommand } from "@/components/shared/SearchCommand";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col bg-background">
        {/* Streamlined Sticky Header with Integrated Breadcrumbs & Search Command */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
               <SidebarTrigger className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
               <Separator orientation="vertical" className="h-4 hidden sm:block" />
            </div>

            <div className="flex-1 max-w-[60%] hidden md:block">
              <DynamicBreadcrumb />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:block">
               <SearchCommand />
             </div>
             
             <Separator orientation="vertical" className="h-4 mx-1 hidden sm:block" />
             
             <div className="flex items-center gap-2">
                <ThemeToggle />
             </div>
          </div>
        </header>

        {/* Scrollable Main Area - Max Width for Large Screens */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-full animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
