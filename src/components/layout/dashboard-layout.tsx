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
  Bell,
  CheckCircle2,
  AlertCircle
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload Material", href: "/dashboard/upload" },
  { icon: BookOpenCheck, label: "Quizzes", href: "/dashboard/quiz" },
  { icon: CalendarRange, label: "Planner", href: "/dashboard/planner" },
  { icon: Timer, label: "Focus Mode", href: "/dashboard/focus" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
];

const mockNotifications = [
  { id: 1, title: "Quiz Ready", description: "AI has generated a quiz for 'Calculus III'", time: "2m ago", icon: BookOpenCheck, color: "text-primary" },
  { id: 2, title: "Attendance Warning", description: "Your attendance in 'Data Structures' is below 75%", time: "1h ago", icon: AlertCircle, color: "text-error" },
  { id: 3, title: "Quest Completed", description: "You've finished your focus goal for today!", time: "3h ago", icon: CheckCircle2, color: "text-success" },
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
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-900 border-b sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-4">
            <SidebarTrigger className="h-9 w-9" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <h2 className="font-medium text-sm md:text-base text-slate-600 dark:text-slate-400 truncate max-w-[120px] md:max-w-none">
              {menuItems.find(i => i.href === pathname)?.label || "Quest Details"}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 h-9 w-9">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-slate-50/50">
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="grid">
                    {mockNotifications.map((notif) => (
                      <button 
                        key={notif.id} 
                        className="flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors border-b last:border-0"
                      >
                        <div className={cn("mt-1", notif.color)}>
                          <notif.icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold">{notif.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{notif.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" className="text-xs w-full h-8 font-semibold">View all</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-9 w-9 hidden md:flex">
              <Settings className="h-5 w-5 text-slate-600" />
            </Button>
            <Avatar className="h-8 w-8 md:hidden border border-slate-200">
              <AvatarImage src="https://picsum.photos/seed/user123/100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}