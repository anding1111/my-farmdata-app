
import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { StructureLogger } from "@/components/ui/structure-logger";
import { useDataStructures } from "@/hooks/useDataStructures";
import { StructureLoggerProvider, useStructureLoggerContext } from "@/context/StructureLoggerContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayoutContent = ({ children }: DashboardLayoutProps) => {
  // Inicializar estructuras para generar logs
  useDataStructures();
  
  const { logs, isVisible, clearLogs, toggleVisibility } = useStructureLoggerContext();

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

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <StructureLoggerProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </StructureLoggerProvider>
  );
};

export default DashboardLayout;
