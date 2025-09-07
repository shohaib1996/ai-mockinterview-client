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
        {
          title: "Create listening lesson",
          url: "/dashboard/admin/ielts/listening",
          icon: "inbox",
        },
        { title: "Create reading lesson", url: "/dashboard/admin/ielts/reading", icon: "inbox" },
        { title: "Create writing lesson", url: "/dashboard/admin/ielts/writing", icon: "inbox" },
      ],
    },
    {
      title: "All Questions",
      icon: "calendar",
      url: "/dashboard/admin/questions"
    },
    { title: "Quiz", url: "/dashboard/admin/quiz", icon: "calendar" },
    { title: "All User", url: "/dashboard/admin/users", icon: "calendar" },
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

