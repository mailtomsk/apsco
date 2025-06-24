import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    visiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    visiblePages = 3
}) => {
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    return (
        <div className="flex justify-end mt-4 mb-4 space-x-1 px-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
                Prev
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-1 text-sm border rounded text-gray-700 hover:bg-gray-100"
                    >
                        1
                    </button>
                    <span className="px-2 py-1 text-gray-400">...</span>
                </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const page = startPage + i;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm border rounded ${currentPage === page
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {endPage < totalPages && (
                <>
                    <span className="px-2 py-1 text-gray-400">...</span>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-1 text-sm border rounded text-gray-700 hover:bg-gray-100"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
