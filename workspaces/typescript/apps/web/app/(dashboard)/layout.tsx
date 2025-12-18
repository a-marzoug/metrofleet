"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen flex">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
