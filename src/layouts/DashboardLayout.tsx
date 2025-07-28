import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { DataStructuresProvider } from "@/context/DataStructuresContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayoutContent = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <DataStructuresProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DataStructuresProvider>
  );
};

export default DashboardLayout;