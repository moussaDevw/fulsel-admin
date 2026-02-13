'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, ChevronRight, Home } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex font-sans">
                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                    {/* Mobile Header */}
                    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm md:shadow-none">
                        <div className="flex items-center">
                            <button className="md:hidden mr-4 text-gray-600" onClick={() => setSidebarOpen(true)}>
                                <Menu size={24} />
                            </button>
                            <div className="md:hidden font-bold text-fulser-blue">FULSER ADMIN</div>

                            {/* Breadcrumb for Desktop */}
                            <div className="hidden md:flex items-center text-sm text-gray-500">
                                <Home size={14} className="mr-2" />
                                <ChevronRight size={14} className="mx-1" />
                                <span className="capitalize">Admin</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-right">
                                <div className="mr-3 hidden md:block">
                                    <p className="text-sm font-bold text-slate-800">Admin User</p>
                                    <p className="text-xs text-gray-500">Administrateur</p>
                                </div>
                                <div className="h-9 w-9 bg-fulser-gold rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                    AD
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
