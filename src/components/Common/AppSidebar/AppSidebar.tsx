"use client";

import type React from "react";

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
  User,
  LayoutDashboard,
  GraduationCap,
  Headphones,
  BookOpen,
  PenTool,
  HelpCircle,
  Brain,
  Users,
  Mic,
  MessageCircle,
  Code,
  ClipboardCheck,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "../../ui/button";
import { ModeToggle } from "../../ThemeProvider/ModeToggle";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { logout } from "@/redux/feature/auth/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import { baseApi } from "@/redux/api/baseApi";
import { useGetProfileQuery } from "@/redux/api/user/usersApi";
import { ISingleUser } from "@/types";

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  calendar: Calendar,
  inbox: Inbox,
  search: Search,
  settings: Settings,
  message: SendToBack,
  LayoutDashboard: LayoutDashboard,
  Calendar: Calendar,
  GraduationCap: GraduationCap,
  Headphones: Headphones,
  BookOpen: BookOpen,
  PenTool: PenTool,
  HelpCircle: HelpCircle,
  Brain: Brain,
  Users: Users,
  Mic: Mic,
  MessageCircle: MessageCircle,
  Code: Code,
  ClipboardCheck: ClipboardCheck,
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data } = useGetProfileQuery({});
  const user: ISingleUser = data?.data;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  const handleDropdownItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setDropdownOpen(false);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className={`flex-shrink-0 transition-all duration-300 flex flex-col   ${
        open ? "w-64" : isMobile ? "w-0" : "w-16"
      }`}
    >
      {/* Header */}
      <SidebarHeader className="dark:bg-[#1D2B64]">
        {open && (
          <div className="font-semibold flex items-center px-2 justify-between gap-2">
            <Link
              href="/"
              className="text-lg font-semibold flex items-center gap-2"
            >
              <Image
                src={logo || "/placeholder.svg"}
                width={32}
                height={32}
                alt="logo"
              />
              LinguaAI
            </Link>
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
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent
        className={`flex-1 overflow-y-auto dark:bg-[#1D2B64] ${
          open && "w-64"
        } `}
      >
        <SidebarGroup>
          {open && <SidebarGroupLabel>Application</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className={`${open ? "hidden" : "block"}`}>
              <Link href="/">
                <Image src={logo} alt="logo" width={32} height={32} />
              </Link>
            </SidebarMenu>
            <SidebarMenu>
              <Button
                variant="ghost"
                onClick={() => setOpen(!open)}
                className={`p-1 rounded hover:bg-muted ${
                  open ? "hidden" : "block"
                }`}
              >
                {open ? (
                  <ChevronsLeft className="w-4 h-4" />
                ) : (
                  <ChevronsRight className="w-4 h-4" />
                )}
              </Button>
            </SidebarMenu>
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
      <SidebarFooter className="p-2 dark:bg-[#1D2B64]">
        {open ? (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 justify-start w-full p-2 h-auto"
              >
                <Avatar>
                  <AvatarImage
                    src={user?.avatarUrl || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 w-full">
                  <Settings className="w-4 h-4" />
                  <span className="flex-1">Theme</span>
                  <ModeToggle />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDropdownItemClick(handleLogout)}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 w-full">
                  <Settings className="w-4 h-4" />
                  <span className="flex-1">Theme</span>
                  <ModeToggle />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDropdownItemClick(handleLogout)}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
  const hasChildren = item.children && item.children?.length > 0;
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => hasChildren && setOpen(!open)}
        >
          <Link
            href={item.url || "#"}
            className="flex items-center gap-2 w-full"
          >
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
