"use client";

import { useState } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  SendToBack,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  calendar: Calendar,
  inbox: Inbox,
  search: Search,
  settings: Settings,
  message: SendToBack,
};

type MenuItem = {
  title: string;
  url?: string;
  icon?: string;
  children?: MenuItem[];
};

interface AppSidebarProps {
  items: MenuItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const { open, setOpen, isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="offcanvas" // Use offcanvas to hide sidebar completely
      className={`flex-shrink-0 transition-all duration-300 flex flex-col ${
        open ? "w-64" : isMobile ? "w-0" : "w-16"
      }`}
    >
      {/* Header */}
      <SidebarHeader className="flex items-center justify-between px-2">
        {open && <span className="font-semibold">AI Mock Interview</span>}
        <Button
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="p-1 rounded hover:bg-muted"
        >
          {open ? (
            <ChevronsLeft className="w-4 h-4" />
          ) : (
            <ChevronsRight className="w-4 h-4" />
          )}
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className={`flex-1 overflow-y-auto ${open && "w-64"}`}>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Application</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <MenuItemComponent
                  key={item.title}
                  item={item}
                  collapsed={!open}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2">
        <Link
          href="/logout"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          {open && <span>Logout</span>}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

function MenuItemComponent({
  item,
  collapsed,
}: {
  item: MenuItem;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => hasChildren && setOpen(!open)}
        >
          <Link href={item.url || "#"} className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {!collapsed && <span>{item.title}</span>}
          </Link>
          {!collapsed &&
            hasChildren &&
            (open ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </div>
      </SidebarMenuButton>

      {/* Children */}
      {hasChildren && open && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => {
            const ChildIcon = child.icon ? iconMap[child.icon] : null;
            return (
              <Link
                key={child.title}
                href={child.url || "#"}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {ChildIcon && <ChildIcon className="w-3 h-3" />}
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </SidebarMenuItem>
  );
}