import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/shared/DynamicBreadcrumb";
import SearchbarInput from "@/components/shared/SearhbarInput";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 shadow-sm">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1 hover:bg-zinc-100 dark:hover:bg-zinc-800" />
            <div className="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden lg:block w-full max-w-md">
              <SearchbarInput />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-3 p-4 pt-4">
          <div className="mb-2">
            <DynamicBreadcrumb />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
