
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Plus, MoreVertical } from "lucide-react";

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
    <div className="bg-white border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">FarmaData</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
