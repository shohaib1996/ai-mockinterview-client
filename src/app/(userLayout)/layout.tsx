"use client";
import { AppSidebar } from "@/components/Common/AppSidebar/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const userMenu = [
     { title: "Dashboard", url: "/dashboard/user", icon: "calendar" },
    {
      title: "IELTS Sessions",
      icon: "home",
      children: [
        { title: "Speaking", url: "/dashboard/ielts/speaking", icon: "inbox" },
        {
          title: "Listening",
          url: "/dashboard/ielts/listening",
          icon: "inbox",
        },
        { title: "Reading", url: "/dashboard/ielts/reading", icon: "inbox" },
        { title: "Writing", url: "/dashboard/ielts/writing", icon: "inbox" },
      ],
    },
    { title: "Mock Test", url: "/dashboard/mock-test", icon: "calendar" },
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
