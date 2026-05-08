import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Settings, DollarSign, FileText, Layers, Search, Bell, User, PlusCircle, Sparkles, Sliders, Calendar } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/add-process", label: "Add Process", icon: PlusCircle },
  { path: "/simulation-playground", label: "Simulation Playground", icon: Sliders },
  { path: "/production-planning", label: "Production Planning", icon: Calendar },
  { path: "/cost-efficiency", label: "Cost Efficiency", icon: DollarSign },
  { path: "/yard-resources", label: "Yard Resources", icon: Layers },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings }
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img
  src="https://iconape.com/wp-content/files/vm/187820/svg/187820.svg"
  alt="L&T Logo"
  className="h-10 object-contain"
/>
          <p className="text-xs text-gray-600 mt-1">AI Yard Optimizer</p>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-[#005EB8] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="font-semibold mb-1">Fixed Capacity</div>
            <div>24 Moulds • 8 Chambers • 4 Cranes</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Hi Rajesh, Welcome to L&T Precast AI!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search processes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-[#005EB8] rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
