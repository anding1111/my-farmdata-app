
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Plus } from "lucide-react";

interface TopBarProps {
  title?: string;
  count?: number;
  onSearchChange?: (value: string) => void;
  onViewModeChange?: (mode: "grid" | "list") => void;
  onAddNewClick?: () => void;
}

const TopBar = ({ 
  title = "Mis vitaminas", 
  count = 6, 
  onSearchChange, 
  onViewModeChange,
  onAddNewClick
}: TopBarProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const handleAddNew = () => {
    if (onAddNewClick) {
      onAddNewClick();
    }
  };

  return (
    <div className="bg-white border-b p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="relative w-full max-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar en archivos..."
            className="pl-8 w-full"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => handleViewModeChange("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => handleViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium text-muted-foreground">
          {title} <span className="text-foreground">{count}</span>
        </div>
      </div>
      
      <Button onClick={handleAddNew} className="md:ml-auto">
        <Plus className="h-4 w-4 mr-1" /> Añadir nueva lista
      </Button>
    </div>
  );
};

export default TopBar;
