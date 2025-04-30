
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Grid, List } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
}

// Este componente se mantiene por compatibilidad, pero se recomienda usar TopBar
const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <header className="flex items-center justify-between h-16 p-4 border-b bg-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative max-w-[240px] w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
