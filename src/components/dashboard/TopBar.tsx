
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Plus, MoreVertical, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const { logout, user } = useAuth();

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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="bg-white border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">FarmaData</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          ¡Hola, {user?.name}!
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
