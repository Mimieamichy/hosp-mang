"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchStartsWith?: boolean; // If true, active if pathname starts with href
}

interface SidebarLayoutProps {
  navItems: NavItem[];
  children: React.ReactNode;
  defaultOpen?: boolean;
  roleName: string;
}

export function SidebarLayout({ navItems, children, defaultOpen = true, roleName }: SidebarLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              MediTrack Lite
            </span>
          </div>
          <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {roleName} Portal
          </p>
        </SidebarHeader>

        <SidebarContent asChild>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {navItems.map((item) => {
                const isActive = item.matchStartsWith 
                  ? pathname.startsWith(item.href)
                  : pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={{ content: item.label, side: "right", align: "center" }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-2">
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ content: "Home", side: "right", align: "center" }}>
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Add a Log Out button, conceptual for now */}
            <SidebarMenuItem>
                <SidebarMenuButton className="text-destructive hover:bg-destructive/10 hover:text-destructive" tooltip={{ content: "Log Out", side: "right", align: "center" }}>
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Breadcrumbs or global search could go here */}
          </div>
          {/* User Menu could go here */}
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
