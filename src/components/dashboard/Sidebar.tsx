
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true); // Inicialmente cerrado
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Usuario", "avatar": ""}');

  const menuItems = [
    {
      name: "Ventas",
      path: "/dashboard",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Inventario",
      path: "/dashboard/inventario",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      path: "/dashboard/clientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Proveedores",
      path: "/dashboard/proveedores",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Reportes",
      path: "/dashboard/reportes",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      path: "/dashboard/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Cerrar el sidebar cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && !collapsed) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed]);

  // Cerrar el sidebar al cambiar de ruta
  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]",
        className
      )}
    >
      <div className="flex h-[60px] items-center px-4 justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div className="font-medium text-white">
              {user.name ? `Hola, ${user.name.split(' ')[0]}` : "Hola"}
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-primary-600"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {!collapsed && (
        <div className="px-4 py-2">
          <div className="text-xs font-medium text-white/70 uppercase tracking-wider">
            Categorías
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 pt-2">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary-600 text-white"
                  : "hover:bg-primary-600 text-white/80 hover:text-white"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/80 hover:bg-primary-600 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
