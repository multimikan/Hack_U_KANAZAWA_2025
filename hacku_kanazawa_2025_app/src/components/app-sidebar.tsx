// src/components/app-sidebar.tsx
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { EXTENTION_HEADER_HEIGHT } from "./header/Header";
import { FitFrameToContentMenuItem, Tldraw } from "tldraw";
import React from "react";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar style={{ top: EXTENTION_HEADER_HEIGHT }} variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="w-full h-hull">
            {children}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
