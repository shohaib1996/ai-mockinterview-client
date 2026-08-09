"use client";

import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { logout } from "@/redux/feature/auth/authSlice";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";
import { ModeToggle } from "../ThemeProvider/ModeToggle";
import { useGetProfileQuery } from "@/redux/api/user/usersApi";
import { ISingleUser } from "@/types";
import { useRouter } from "next/navigation";
import { baseApi } from "@/redux/api/baseApi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useGetProfileQuery({});
  const user: ISingleUser = data?.data;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "How it works", href: "/#how" },
    { label: "Dashboards", href: "/#dashboards" },
    { label: "Mock test", href: "/#mocktest" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-sm border-gray-800"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image alt="logo" src={logo} width={50} height={50} />
              <span className="text-white font-bold text-xl">
                IELTS<span className="text-[#06D6A0]">Zen</span>AI
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#06D6A0] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button / User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Force ModeToggle to fixed size so icon swap won't resize layout */}
            <div className="w-9 h-9 flex items-center justify-center">
              {/* pass className so ModeToggle can respect fixed size */}
              <div className="w-9 h-9">
                <ModeToggle />
              </div>
            </div>

            {user ? (
              <DropdownMenu>
                {/* Use an actual button as the trigger (keeps layout stable) */}
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                    aria-label="Open user menu"
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
                  </button>
                </DropdownMenuTrigger>

                {/* Render content in a portal/offset so it doesn't affect layout; limit min width */}
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="min-w-[160px]"
                >
                  <DropdownMenuItem disabled className="cursor-default">
                    {user?.name}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link
                    href={
                      user.role === "ADMIN"
                        ? "/dashboard/admin"
                        : "/dashboard/user"
                    }
                  >
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <Link href="/about" className="block md:hidden lg:hidden">
                    <DropdownMenuItem>About</DropdownMenuItem>
                  </Link>
                  <Link href="/contact" className="block md:hidden lg:hidden">
                    <DropdownMenuItem>Contact</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button className="bg-[#06D6A0] text-black hover:bg-[#05b98f] font-semibold shadow-[0_0_0_rgba(6,214,160,0.4)] hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-shadow">
                    Get started
                  </Button>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
