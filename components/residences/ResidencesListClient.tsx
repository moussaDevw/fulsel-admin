'use client';

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MapPin
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Link from 'next/link';

interface Residence {
    id: string | bigint;
    title: string;
    slug: string;
    image_cover: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    location: string | null;
}

interface ResidencesListClientProps {
    residences: any[];
}

export default function ResidencesListClient({ residences }: ResidencesListClientProps) {
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    const filteredResidences = residences.filter(r => {
        const matchesFilter = filter === 'ALL' || r.status === filter;
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const statusOptions = [
        { id: 'ALL', label: 'Tous' },
        { id: 'draft', label: 'Brouillon' },
        { id: 'en_cours', label: 'En cours' },
        { id: 'venir', label: 'À venir' },
        { id: 'livr_', label: 'Livré' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des Résidences</h1>
                <Link
                    href="/admin/residences/new"
                    className="flex items-center justify-center px-4 py-2 bg-fulser-gold text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} className="mr-2" /> Nouvelle Résidence
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {statusOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => setFilter(option.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === option.id
                                    ? 'bg-fulser-blue text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="relative md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-fulser-gold/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Résidence</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Localisation</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Période</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredResidences.map((resience) => (
                                <tr key={resience.id.toString()} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                                {resience.image_cover ? (
                                                    <img src={resience.image_cover} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
                                                        FR
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-800">{resience.title}</div>
                                                <div className="text-xs text-gray-500">{resience.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={resience.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            {resience.location?.startsWith('http') ? (
                                                <a href={resience.location} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                                                    <MapPin size={14} className="mr-1.5" />
                                                    Voir Map
                                                </a>
                                            ) : (
                                                <span className="flex items-center text-gray-500">
                                                    <MapPin size={14} className="mr-1.5" />
                                                    {resience.location || 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col text-xs">
                                            <span>
                                                {resience.startDate ? new Date(resience.startDate).getFullYear() : 'N/A'} - {resience.endDate ? new Date(resience.endDate).getFullYear() : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/residences/${resience.id}`}
                                                className="p-1.5 text-gray-500 hover:text-fulser-blue hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => {/* Handle Delete */}}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredResidences.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Aucune résidence trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
