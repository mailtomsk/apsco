import React from 'react';
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "../../admin/context/ThemeContext";
interface AdminLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

const LayoutContent: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {

    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <ThemeProvider>
            <div className="min-h-screen xl:flex">
                <div>
                    <AppSidebar />
                    <Backdrop />
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                        } ${isMobileOpen ? "ml-0" : ""}`}
                >
                    <AppHeader onLogout={onLogout} />
                    <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

const AppLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
    return (
        <SidebarProvider>
            <LayoutContent onLogout={onLogout}>{children}</LayoutContent>
        </SidebarProvider>
    );
};

export default AppLayout; 