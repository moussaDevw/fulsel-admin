'use client';

import React from 'react';
import {
    Building2,
    CheckCircle,
    Users
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const CHART_DATA = [
    { name: 'Jan', value: 4 },
    { name: 'Fév', value: 3 },
    { name: 'Mar', value: 6 },
    { name: 'Avr', value: 8 },
    { name: 'Mai', value: 7 },
    { name: 'Juin', value: 9 },
];

interface DashboardClientProps {
    stats: {
        totalResidences: number;
        completedResidences: number;
        totalUsers: number;
    }
}

export default function DashboardClient({ stats }: DashboardClientProps) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Résidences Totales', value: stats.totalResidences, icon: <Building2 className="text-blue-500" />, change: 'Projets immobiliers' },
                    { label: 'Résidences Livrées', value: stats.completedResidences, icon: <CheckCircle className="text-green-500" />, change: 'Projets terminés' },
                    { label: 'Utilisateurs', value: stats.totalUsers, icon: <Users className="text-purple-500" />, change: 'Admin & Éditeurs' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                        </div>
                        <div className="mt-4 text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Activité des Résidences (6 mois)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f3359', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#d99541" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Actions Récentes</h3>
                    <div className="space-y-4">
                        {[
                            { text: "Nouvelle résidence créée: Villa Océane", time: "Il y a 2h", type: "add" },
                            { text: "Mise à jour statut: Tour Horizon", time: "Il y a 5h", type: "update" },
                            { text: "3 nouvelles images uploadées", time: "Hier", type: "upload" },
                        ].map((action, i) => (
                            <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${action.type === 'add' ? 'bg-green-500' :
                                    action.type === 'update' ? 'bg-blue-500' :
                                        action.type === 'upload' ? 'bg-amber-500' : 'bg-purple-500'
                                    }`} />
                                <div>
                                    <p className="text-sm text-slate-700">{action.text}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{action.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
