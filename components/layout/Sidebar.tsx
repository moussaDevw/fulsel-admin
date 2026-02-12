'use client';

import React from 'react';
import {
    LayoutDashboard,
    Building2,
    ImageIcon,
    Settings,
    Users,
    LogOut,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();

    const navItems = [
        { id: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
        { id: '/admin/residences', label: 'Résidences', icon: <Building2 size={20} /> },
        { id: '/admin/users', label: 'Utilisateurs', icon: <Users size={20} /> },
        { id: '/admin/settings', label: 'Paramètres', icon: <Settings size={20} /> },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin';
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 h-full bg-fulser-blue text-white w-64 z-30 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col
      `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 bg-slate-900/50">
                    <div className="flex items-center space-x-2 font-bold text-xl tracking-wide">
                        <span className="text-fulser-gold">FULSER</span>
                        <span>ADMIN</span>
                    </div>
                    <button className="ml-auto md:hidden" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.id}
                            onClick={() => setIsOpen(false)}
                            className={`
                flex items-center px-6 py-3 text-sm font-medium transition-colors
                ${isActive(item.id)
                                    ? 'bg-fulser-gold/20 text-fulser-gold border-r-4 border-fulser-gold'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              `}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-6 border-t border-white/10 bg-slate-900/30">
                    <button
                        onClick={() => {/* Handle Logout */}}
                        className="flex items-center w-full text-sm font-medium text-red-300 hover:text-red-200 transition-colors"
                    >
                        <LogOut size={18} className="mr-3" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
};
