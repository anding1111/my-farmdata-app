
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { StructureLogger } from "@/components/ui/structure-logger";
import { DataStructuresProvider } from "@/context/DataStructuresContext";
import { StructureLoggerProvider, useStructureLoggerContext } from "@/context/StructureLoggerContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayoutContent = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  
  const { logs, isVisible, clearLogs, toggleVisibility, setActiveStructure, activeStructure } = useStructureLoggerContext();

  // Determinar estructura activa según la ruta
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/inventario')) {
      // Obtener el hash o parámetros para determinar la pestaña activa
      const hash = location.hash.replace('#', '');
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab') || hash;
      
      switch (tab) {
        case 'products':
        case '': // Por defecto en inventario es productos
          setActiveStructure('AvlTree');
          break;
        case 'ventas':
          setActiveStructure('LinkedList');
          break;
        case 'turnos':
          setActiveStructure('LinkedQueue');
          break;
        case 'analisis':
          setActiveStructure('Graph');
          break;
        default:
          setActiveStructure('AvlTree'); // Por defecto productos
      }
    } else if (path.includes('/dashboard')) {
      // En el dashboard principal usar AVL Tree para productos
      setActiveStructure('AvlTree');
    } else {
      setActiveStructure(null);
    }
  }, [location.pathname, location.search, location.hash, setActiveStructure]);

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
        activeStructure={activeStructure}
        onToggleVisibility={toggleVisibility}
        onClear={clearLogs}
      />
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <StructureLoggerProvider>
      <DataStructuresProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </DataStructuresProvider>
    </StructureLoggerProvider>
  );
};

export default DashboardLayout;
