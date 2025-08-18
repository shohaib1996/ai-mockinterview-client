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
} from "@/components/ui/sidebar";
import Link from "next/link";

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
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function AppSidebar({
  items,
  collapsed,
  setCollapsed,
}: AppSidebarProps) {
  console.log(collapsed);
  return (
    <Sidebar
      collapsed={collapsed} // Pass the collapsed prop
      className={`${
        collapsed ? "w-16" : "w-64"
      } flex-shrink-0 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <SidebarHeader className="flex items-center justify-between px-2">
        {!collapsed && <span className="font-semibold">Ai Mock Interview</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-muted"
        >
          {collapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Application</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <MenuItemComponent
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
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
          {!collapsed && <span>Logout</span>}
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
