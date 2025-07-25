import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  MapPin,
  Play
} from "lucide-react";


// Mock data adaptado para farmacia
const mockStats = {
  totalSales: 125430000, // Ventas totales del mes
  totalProducts: 9178,   // Productos en inventario
  totalValue: 748000000, // Valor total del inventario
  target: 9200,          // Meta de productos
  monthlyGrowth: 12.5,   // Crecimiento mensual
  lowStockAlerts: 3,     // Alertas de stock bajo
  expiringProducts: 8,   // Productos próximos a vencer
  activeUsers: 12,       // Usuarios activos
  totalCustomers: 856,   // Total de clientes
  pendingOrders: 23,     // Órdenes pendientes
  topCategories: [
    { name: "Vitaminas", sales: 45, icon: "💊" },
    { name: "Analgésicos", sales: 32, icon: "🩹" },
    { name: "Antibióticos", sales: 18, icon: "💉" }
  ]
};

const mockActivities = [
  {
    id: 1,
    type: "Inventario Crítico",
    description: "Productos con stock bajo",
    progress: 15,
    timeLeft: "Requiere atención",
    distance: `${mockStats.lowStockAlerts} productos`,
    icon: "📦",
    bgColor: "from-red-500 to-red-600",
    priority: "high"
  },
  {
    id: 2,
    type: "Productos por Vencer",
    description: "Próximos a expirar",
    progress: 70,
    timeLeft: "30 días o menos",
    distance: `${mockStats.expiringProducts} productos`,
    icon: "⏰",
    bgColor: "from-orange-500 to-orange-600",
    priority: "medium"
  },
  {
    id: 3,
    type: "Ventas del Mes",
    description: "Meta mensual",
    progress: 90,
    timeLeft: "5 días restantes",
    distance: `${mockStats.totalProducts}/${mockStats.target}`,
    icon: "💰",
    bgColor: "from-green-500 to-green-600",
    priority: "low"
  }
];

const mockTeam = [
  { name: "Dr. García", role: "Farmacéutico Jefe", time: "Activo ahora", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png", status: "online" },
  { name: "Ana López", role: "Auxiliar Farmacia", time: "5 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png", status: "online" },
  { name: "Carlos Ruiz", role: "Vendedor", time: "15 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png", status: "away" },
  { name: "María Santos", role: "Administradora", time: "1 hora ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png", status: "online" },
  { name: "Pedro Mora", role: "Bodeguero", time: "2 horas ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png", status: "offline" }
];

const Dashboard = () => {
  const [currentMonth] = useState("Abril");
  const [salesData] = useState([
    { month: "Ene", value: 850 },
    { month: "Feb", value: 920 },
    { month: "Mar", value: 870 },
    { month: "Abr", value: 918 },
    { month: "May", value: 950 },
    { month: "Jun", value: 880 },
    { month: "Jul", value: 920 },
    { month: "Ago", value: 940 },
    { month: "Sep", value: 890 },
    { month: "Oct", value: 930 }
  ]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">FarmaData Dashboard</h1>
              <p className="text-slate-500">Panel Principal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Equipo</span>
                <span className="text-xs text-slate-500">Ver Todo</span>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" alt="Usuario" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Overview Card - Main Chart */}
            <div className="col-span-8">
              <Card className="h-80 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 border-0 shadow-2xl overflow-hidden">
                <CardHeader className="text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg font-medium">Resumen General</CardTitle>
                    </div>
                    <select className="bg-white/20 text-white border-white/30 rounded-lg px-3 py-1 text-sm">
                      <option>Mensual</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="text-white">
                  {/* Simple chart simulation */}
                  <div className="relative h-32 mb-6">
                    <svg className="w-full h-full" viewBox="0 0 400 100">
                      <polyline
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="3"
                        points="0,80 50,70 100,75 150,60 200,45 250,55 300,40 350,35 400,30"
                        className="drop-shadow-lg"
                      />
                      {/* Highlight point */}
                      <circle cx="200" cy="45" r="6" fill="white" className="drop-shadow-lg animate-pulse" />
                    </svg>
                    <div className="absolute top-4 left-48 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                      <div className="text-2xl font-bold">{formatNumber(mockStats.totalProducts)}</div>
                      <div className="text-xs opacity-80">Productos</div>
                    </div>
                  </div>
                  
                  {/* Month indicators */}
                  <div className="flex justify-between text-xs opacity-70 mb-6">
                    {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"].map((month, idx) => (
                      <span key={month} className={month === "Abr" ? "text-white font-medium" : ""}>{month}</span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Ventas Totales</div>
                      <div className="text-2xl font-bold">{formatNumber(mockStats.totalSales)} COP</div>
                      <div className="text-xs opacity-80">{currentMonth}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Total Productos</div>
                      <div className="text-2xl font-bold">{formatNumber(mockStats.totalProducts)}</div>
                      <div className="text-xs opacity-80">{currentMonth}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Meta</div>
                      <div className="text-2xl font-bold">{formatNumber(mockStats.target)}</div>
                      <div className="text-xs opacity-80">{currentMonth}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column cards */}
            <div className="col-span-4 space-y-6">
              {/* Alertas de Inventario */}
              <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-xl text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full">
                      →
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Alertas Críticas</h3>
                  <p className="text-white/80 text-sm">{mockStats.lowStockAlerts} productos con stock bajo</p>
                </CardContent>
              </Card>

              {/* Ventas del Día */}
              <Card className="bg-gradient-to-br from-green-400 to-green-500 border-0 shadow-xl text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full">
                      →
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Ventas Hoy</h3>
                  <div className="mt-4">
                    <div className="text-xs opacity-80 mb-1">Valor Total</div>
                    <div className="text-2xl font-bold">{formatNumber(mockStats.totalSales / 30)} COP</div>
                    <div className="text-xs opacity-80">Promedio diario</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Section */}
            <div className="col-span-8">
              <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">Alertas del Sistema</Button>
                <Button variant="ghost" className="text-slate-600">Reportes</Button>
              </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {mockActivities.map((activity) => (
                  <Card key={activity.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${activity.bgColor} rounded-2xl text-white relative`}>
                          <span className="text-lg">{activity.icon}</span>
                          {activity.priority === 'high' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          •••
                        </Button>
                      </div>
                      
                      <h3 className="font-semibold text-slate-800 mb-1">{activity.type}</h3>
                      <p className="text-sm text-slate-500 mb-4">{activity.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-800">{activity.progress}%</span>
                        </div>
                        <Progress value={activity.progress} className="h-2 bg-slate-100">
                          <div 
                            className={`h-full bg-gradient-to-r ${activity.bgColor} rounded-full transition-all duration-500`}
                            style={{ width: `${activity.progress}%` }}
                          />
                        </Progress>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{activity.distance}</span>
                          <span className={`font-medium ${
                            activity.priority === 'high' ? 'text-red-500' :
                            activity.priority === 'medium' ? 'text-orange-500' : 'text-green-500'
                          }`}>{activity.timeLeft}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Equipo de Trabajo */}
            <div className="col-span-4">
              <div className="space-y-4">
                {mockTeam.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-500 truncate">{member.role}</p>
                      <p className="text-xs text-slate-400">{member.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      💬
                    </Button>
                  </div>
                ))}

                {/* Mapa de Sucursales */}
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-600" />
                        <span className="font-medium text-sm text-slate-800">Sucursales</span>
                      </div>
                      <span className="text-xs text-slate-500">Ver mapa</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg relative overflow-hidden">
                      {/* Mapa simulado */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200"></div>
                      </div>
                      {/* Indicadores de sucursales */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">3</span>
                        </div>
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">2</span>
                        </div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;