
import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { StructureLogger } from "@/components/ui/structure-logger";
import { useStructureLogger } from "@/hooks/useStructureLogger";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logs, isVisible, clearLogs, toggleVisibility } = useStructureLogger();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      
      {/* Logger Visual Flotante */}
      <StructureLogger
        logs={logs}
        isVisible={isVisible}
        onToggleVisibility={toggleVisibility}
        onClear={clearLogs}
      />
    </div>
  );
};

export default DashboardLayout;
