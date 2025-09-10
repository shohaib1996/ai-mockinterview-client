"use client";
import { AppSidebar } from "@/components/Common/AppSidebar/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const adminMenu = [
    { title: "Dashboard", url: "/dashboard/admin", icon: "LayoutDashboard" },
    { title: "All Sessions", url: "/dashboard/sessions", icon: "Calendar" },
    {
      title: "IELTS Sessions",
      icon: "GraduationCap",
      children: [
        {
          title: "Create listening lesson",
          url: "/dashboard/admin/ielts/listening",
          icon: "Headphones",
        },
        { title: "Create reading lesson", url: "/dashboard/admin/ielts/reading", icon: "BookOpen" },
        { title: "Create writing lesson", url: "/dashboard/admin/ielts/writing", icon: "PenTool" },
      ],
    },
    {
      title: "All Questions",
      icon: "HelpCircle",
      url: "/dashboard/admin/questions",
    },
    { title: "Quiz", url: "/dashboard/admin/quiz", icon: "Brain" },
    { title: "All User", url: "/dashboard/admin/users", icon: "Users" },
  ]
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar items={adminMenu} />

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 overflow-auto bg-gradient-to-br dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
          <SidebarTrigger className="m-2" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

