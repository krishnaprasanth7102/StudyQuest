"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  CalendarRange, 
  Timer, 
  BookOpenCheck, 
  UserCheck, 
  Settings, 
  LogOut,
  GraduationCap,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload Material", href: "/dashboard/upload" },
  { icon: BookOpenCheck, label: "Quizzes", href: "/dashboard/quiz" },
  { icon: CalendarRange, label: "Planner", href: "/dashboard/planner" },
  { icon: Timer, label: "Focus Mode", href: "/dashboard/focus" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200 dark:border-slate-800">
        <SidebarHeader className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-primary">StudyQuest</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  className={cn(
                    "h-11 px-4 rounded-xl transition-all duration-200",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-11 px-4 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Link href="/auth/login">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="mt-4">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src="https://picsum.photos/seed/user123/100" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate">John Doe</span>
                  <span className="text-xs text-muted-foreground truncate">Sophomore, CS</span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-slate-50 dark:bg-slate-950/50">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <h2 className="font-medium text-slate-600 dark:text-slate-400">
              {menuItems.find(i => i.href === pathname)?.label || "Quest Details"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <Settings className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </header>
        <main className="p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
