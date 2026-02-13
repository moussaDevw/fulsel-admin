
export default function ResidencesLoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
                    ))}
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                                            <div className="ml-4 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
