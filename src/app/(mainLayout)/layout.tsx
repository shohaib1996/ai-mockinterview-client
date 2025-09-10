import Navbar from "@/components/HomePage/Navbar";
import Footer from "@/components/HomePage/Footer";
import type React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
