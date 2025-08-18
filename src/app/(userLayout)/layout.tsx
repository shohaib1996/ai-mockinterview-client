"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/Common/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Home, Inbox } from "lucide-react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const userMenu = [
    { title: "Home", url: "/", icon: "home" },
    { title: "My Profile", url: "/profile", icon: "calendar" },
    {
      title: "Messages",
      icon: "inbox",
      children: [
        { title: "Inbox", url: "/messages/inbox", icon: "inbox" },
        { title: "Sent", url: "/messages/sent", icon: "message" },
      ],
    },
  ];

  return (
    <SidebarProvider>
      {/* Flex container for sidebar + main */}
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar items={userMenu} collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content resizes automatically */}
        <main className="flex-1 transition-all duration-300 overflow-auto">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
