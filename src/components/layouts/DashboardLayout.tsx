import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};
