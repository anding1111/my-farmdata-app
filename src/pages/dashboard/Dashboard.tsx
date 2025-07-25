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


// Mock data para el dashboard
const mockStats = {
  totalSales: 125430000,
  totalProducts: 9178,
  totalValue: 748000000,
  target: 9200,
  monthlyGrowth: 12.5,
  lowStockAlerts: 3,
  expiringProducts: 8,
  activeUsers: 12
};

const mockActivities = [
  {
    id: 1,
    type: "Bicycle Drill",
    description: "36 km / week",
    progress: 45,
    timeLeft: "2 días left",
    distance: "17 / 30km",
    icon: "🚴‍♀️",
    bgColor: "from-purple-500 to-purple-600"
  },
  {
    id: 2,
    type: "Jogging Hero",
    description: "12 km / month",
    progress: 13,
    timeLeft: "17 días left",
    distance: "2 / 15km",
    icon: "🏃‍♂️",
    bgColor: "from-purple-500 to-purple-600"
  },
  {
    id: 3,
    type: "Healthy Busy",
    description: "3600 steps / week",
    progress: 90,
    timeLeft: "3 días left",
    distance: "3200/ 3600 steps",
    icon: "👟",
    bgColor: "from-purple-500 to-purple-600"
  }
];

const mockFriends = [
  { name: "Max Stone", activity: "Weekly Bicycle", time: "12 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" },
  { name: "Grisha Jack", activity: "Slow Jogging", time: "52 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" },
  { name: "Levi Pattrick", activity: "Morning Swim", time: "3 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" },
  { name: "Cody Bryan", activity: "Quick Sprint", time: "7 min ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" },
  { name: "Max Stone", activity: "Hiking", time: "1 hour ago", avatar: "/lovable-uploads/19ed890b-739f-4aeb-9f51-79ea5f291bd7.png" }
];

const Dashboard = () => {
  const [currentMonth] = useState("April");
  const [chartData] = useState([
    { month: "Jan", value: 850 },
    { month: "Feb", value: 920 },
    { month: "Mar", value: 870 },
    { month: "Apr", value: 918 },
    { month: "May", value: 950 },
    { month: "Jun", value: 880 },
    { month: "Jul", value: 920 },
    { month: "Aug", value: 940 },
    { month: "Sep", value: 890 },
    { month: "Oct", value: 930 }
  ]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500">Primary</p>
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
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Friends</span>
                <span className="text-xs text-slate-500">View All</span>
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
                      <CardTitle className="text-white text-lg font-medium">Overview</CardTitle>
                    </div>
                    <select className="bg-white/20 text-white border-white/30 rounded-lg px-3 py-1 text-sm">
                      <option>Monthly</option>
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
                      <div className="text-2xl font-bold">9.178</div>
                      <div className="text-xs opacity-80">Steps</div>
                    </div>
                  </div>
                  
                  {/* Month indicators */}
                  <div className="flex justify-between text-xs opacity-70 mb-6">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, idx) => (
                      <span key={month} className={month === "Apr" ? "text-white font-medium" : ""}>{month}</span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Total Time</div>
                      <div className="text-2xl font-bold">748 Hr</div>
                      <div className="text-xs opacity-80">April</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Total Steps</div>
                      <div className="text-2xl font-bold">9.178 St</div>
                      <div className="text-xs opacity-80">April</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">Target</div>
                      <div className="text-2xl font-bold">9.200 St</div>
                      <div className="text-xs opacity-80">April</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column cards */}
            <div className="col-span-4 space-y-6">
              {/* Daily Jogging */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Activity className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full">
                      →
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Daily Jogging</h3>
                  <p className="text-white/80 text-sm">Stay active and healthy</p>
                </CardContent>
              </Card>

              {/* My Jogging */}
              <Card className="bg-gradient-to-br from-pink-400 to-pink-500 border-0 shadow-xl text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full">
                      →
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">My Jogging</h3>
                  <div className="mt-4">
                    <div className="text-xs opacity-80 mb-1">Total Time</div>
                    <div className="text-2xl font-bold">748 hr</div>
                    <div className="text-xs opacity-80">July</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Section */}
            <div className="col-span-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">Activities</Button>
                  <Button variant="ghost" className="text-slate-600">Online</Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {mockActivities.map((activity) => (
                  <Card key={activity.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${activity.bgColor} rounded-2xl text-white`}>
                          <span className="text-lg">{activity.icon}</span>
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
                          <span className="text-pink-500 font-medium">{activity.timeLeft}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Friends Section */}
            <div className="col-span-4">
              <div className="space-y-4">
                {mockFriends.map((friend, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{friend.name}</p>
                      <p className="text-xs text-slate-500 truncate">{friend.activity}</p>
                      <p className="text-xs text-slate-400">{friend.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      💬
                    </Button>
                  </div>
                ))}

                {/* Live Map */}
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-600" />
                        <span className="font-medium text-sm text-slate-800">Live map</span>
                      </div>
                      <span className="text-xs text-slate-500">View</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg relative overflow-hidden">
                      {/* Simulated map */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200"></div>
                      </div>
                      {/* Activity indicators */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Play className="h-3 w-3 text-white" />
                        </div>
                        <div className="w-6 h-6 bg-slate-400 rounded-full"></div>
                        <div className="w-6 h-6 bg-slate-400 rounded-full"></div>
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