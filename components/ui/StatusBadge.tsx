import React from 'react';

type ResidenceStatus = 'draft' | 'en_cours' | 'venir' | 'livr_';

interface StatusBadgeProps {
    status: ResidenceStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles: Record<string, string> = {
        'en_cours': "bg-blue-100 text-blue-800 border-blue-200",
        'venir': "bg-amber-100 text-amber-800 border-amber-200",
        'livr_': "bg-green-100 text-green-800 border-green-200",
        'draft': "bg-gray-100 text-gray-800 border-gray-200",
    };

    const labels: Record<string, string> = {
        'en_cours': "En cours",
        'venir': "À venir",
        'livr_': "Livré",
        'draft': "Brouillon",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
            {labels[status] || status}
        </span>
    );
};
