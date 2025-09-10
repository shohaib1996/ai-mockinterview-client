"use client"
import { AppSidebar } from "@/components/Common/AppSidebar/AppSidebar"
import type React from "react"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const userMenu = [
    { title: "Dashboard", url: "/dashboard/user", icon: "LayoutDashboard" },
    {
      title: "IELTS Sessions",
      icon: "GraduationCap",
      children: [
        { title: "Speaking", url: "/dashboard/ielts/speaking", icon: "Mic" },
        {
          title: "Listening",
          url: "/dashboard/ielts/listening",
          icon: "Headphones",
        },
        { title: "Reading", url: "/dashboard/ielts/reading", icon: "BookOpen" },
        { title: "Writing", url: "/dashboard/ielts/writing", icon: "PenTool" },
      ],
    },
    {
      title: "Mock Test",
      icon: "ClipboardCheck",
      children: [
        {
          title: "Technical",
          url: "/dashboard/mock-test/technical",
          icon: "Code",
        },
        {
          title: "Behavioral",
          url: "/dashboard/mock-test/behavioral",
          icon: "Users",
        },
        {
          title: "Interpersonal",
          url: "/dashboard/mock-test/interpersonal",
          icon: "MessageCircle",
        },
      ],
    },
    { title: "Quiz", url: "/dashboard/quiz", icon: "Brain" },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar items={userMenu} />

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 overflow-auto bg-gradient-to-br dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
          <SidebarTrigger className="m-2" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default UserLayout
