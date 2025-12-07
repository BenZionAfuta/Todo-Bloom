import { Link, useLocation } from "react-router-dom";
import { Home, ListTodo, CheckCircle, Info, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/tasks", label: "Tasks", icon: ListTodo },
    { path: "/completed", label: "Completed", icon: CheckCircle },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TODO
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-secondary hover:scale-105",
                      isActive && "bg-primary/10 text-primary border border-primary/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
