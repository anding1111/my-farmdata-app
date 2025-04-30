
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Plus } from "lucide-react";

interface TopBarProps {
  itemCount?: number;
  listName?: string;
  onViewChange?: (view: "grid" | "list") => void;
}

const TopBar = ({ 
  itemCount = 0, 
  listName = "Mi lista", 
  onViewChange 
}: TopBarProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    if (onViewChange) {
      onViewChange(mode);
    }
  };

  return (
    <div className="bg-white border-b w-full px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar en archivo"
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center border-l pl-4 ml-2">
          <span className="text-sm font-medium">{listName} {itemCount > 0 && <span className="text-muted-foreground">{itemCount}</span>}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-primary text-white border-primary hover:bg-primary-600 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" /> Añadir nueva lista
        </Button>

        <div className="flex items-center border-l pl-4 ml-2">
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
