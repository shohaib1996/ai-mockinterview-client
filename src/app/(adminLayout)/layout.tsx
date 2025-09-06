"use client";
import { AppSidebar } from "@/components/Common/AppSidebar/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const userMenu = [
    { title: "Dashboard", url: "/dashboard/admin", icon: "calendar" },
    { title: "All Sessions", url: "/dashboard/sessions", icon: "calendar" },
    {
      title: "IELTS Sessions",
      icon: "home",
      children: [
        { title: "Speaking", url: "/dashboard/ielts/speaking", icon: "inbox" },
        {
          title: "Listening Audios",
          url: "/dashboard/admin/ielts/listening",
          icon: "inbox",
        },
        { title: "Reading", url: "/dashboard/admin/ielts/reading", icon: "inbox" },
        { title: "Writing", url: "/dashboard/admin/ielts/writing", icon: "inbox" },
      ],
    },
    {
      title: "Mock Test",
      icon: "calendar",
      children: [
        {
          title: "Technical",
          url: "/dashboard/mock-test/technical",
          icon: "inbox",
        },
        {
          title: "Behavioral",
          url: "/dashboard/mock-test/behavioral",
          icon: "inbox",
        },
        {
          title: "Interpersonal",
          url: "/dashboard/mock-test/interpersonal",
          icon: "inbox",
        },
      ],
    },
    { title: "Quiz", url: "/dashboard/quiz", icon: "calendar" },
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

export default AdminLayout;

