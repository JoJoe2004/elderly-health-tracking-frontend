"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode;}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);
  return (
    
   <div className="h-screen flex flex-col">
      <Header />
     
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-[#E7F2F0] p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
