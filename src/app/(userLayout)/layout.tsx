"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/Common/AppSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Calendar, Home, Inbox } from "lucide-react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const userMenu = [
    { title: "Sessions", url: "/dashboard/user-session", icon: "home" },
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
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar items={userMenu} />

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 overflow-auto">
          <SidebarTrigger className="m-2" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;