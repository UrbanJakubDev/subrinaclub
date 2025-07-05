import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { PaginationProps } from './types'

const Pagination = <T,>({ table }: PaginationProps<T>) => {
    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = table.getPageCount()
    const pageSize = table.getState().pagination.pageSize

    return (
        <div className="flex items-center justify-between mt-8 px-2">
            {/* Left side - Page info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>
                    Stránka <span className="font-medium text-gray-900">{currentPage}</span> z{' '}
                    <span className="font-medium text-gray-900">{totalPages.toLocaleString('cs-CZ')}</span>
                </span>
            </div>

            {/* Center - Navigation buttons */}
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200 disabled:cursor-not-allowed"
                    title="První stránka"
                >
                    <FontAwesomeIcon icon={faAnglesLeft} className="w-4 h-4" />
                </button>
                
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200 disabled:cursor-not-allowed"
                    title="Předchozí stránka"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                {/* Page input */}
                <div className="flex items-center space-x-2 mx-4">
                    <span className="text-sm text-gray-500">Jít na:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        defaultValue={currentPage}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200 disabled:cursor-not-allowed"
                    title="Další stránka"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
                
                <button
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200 disabled:cursor-not-allowed"
                    title="Poslední stránka"
                >
                    <FontAwesomeIcon icon={faAnglesRight} className="w-4 h-4" />
                </button>
            </div>

            {/* Right side - Page size selector */}
            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Zobrazit:</span>
                <select
                    value={pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                    {[5, 10, 23, 30, 40, 50, 100, 150, 200, 300, 500, 5000].map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <span className="text-gray-500">záznamů</span>
            </div>
        </div>
    )
}

export default Pagination 