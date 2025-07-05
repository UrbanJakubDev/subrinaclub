import React from 'react'
import { flexRender } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { TableHeaderProps } from './types'
import Filter from './baseTableFilter'

const TableHeader = <T,>({ headerGroup, table }: TableHeaderProps<T>) => {
    const [showFilters, setShowFilters] = React.useState(true)
    
    // Check if any column has active filters
    const hasActiveFilters = headerGroup.headers.some(header => {
        const filterValue = header.column.getFilterValue()
        return filterValue !== undefined && filterValue !== ""
    })

    const handleSearchClick = () => {
        setShowFilters(!showFilters)
    }

    return (
        <React.Fragment>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                {headerGroup.headers.map(header => {
                    const canSort = header.column.getCanSort()
                    const canFilter = header.column.getCanFilter()
                    const sortDirection = header.column.getIsSorted()
                    const isFiltered = header.column.getFilterValue() !== undefined && header.column.getFilterValue() !== ""

                    const getSortIcon = () => {
                        if (!canSort) return null
                        
                        let icon = faSort
                        let className = "text-gray-400 group-hover:text-gray-600"
                        
                        if (sortDirection === 'asc') {
                            icon = faSortUp
                            className = "text-blue-600"
                        } else if (sortDirection === 'desc') {
                            icon = faSortDown
                            className = "text-blue-600"
                        }

                        return (
                            <FontAwesomeIcon 
                                icon={icon} 
                                className={`w-3 h-3 ml-1 transition-colors duration-200 ${className}`}
                            />
                        )
                    }

                    return (
                        <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="relative px-4 py-3 text-left border-r border-gray-200 last:border-r-0">
                            
                            {/* Header content with sort */}
                            <div 
                                className={`flex items-center justify-between group ${canSort ? 'cursor-pointer select-none hover:bg-gray-50 rounded px-1 py-1 transition-colors duration-200' : ''}`}
                                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            >
                                <div className="flex items-center">
                                    <span className="font-semibold text-gray-700 text-sm">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </span>
                                    {getSortIcon()}
                                </div>
                                
                                {/* Search icon for filters */}
                                {canFilter && (
                                    <div className="flex items-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleSearchClick()
                                            }}
                                            className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                                            title={showFilters ? "Skrýt filtry" : "Zobrazit filtry"}
                                        >
                                            <FontAwesomeIcon 
                                                icon={faSearch} 
                                                className={`w-3 h-3 transition-colors duration-200 ${
                                                    isFiltered 
                                                        ? 'text-blue-500' 
                                                        : showFilters 
                                                            ? 'text-gray-600' 
                                                            : 'text-gray-400'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </th>
                    )
                })}
            </tr>

            {/* Filter row - conditionally shown */}
            {showFilters && (
                <tr className="bg-gray-50/50 border-b border-gray-200 transition-all duration-300">
                    {headerGroup.headers.map(header => {
                        const canFilter = header.column.getCanFilter()
                        
                        return (
                            <th
                                key={`filter-${header.id}`}
                                colSpan={header.colSpan}
                                className="px-4 py-2 border-r border-gray-200 last:border-r-0">
                                
                                {canFilter && (
                                    <div onClick={e => e.stopPropagation()}>
                                        <Filter column={header.column} table={table} />
                                    </div>
                                )}
                            </th>
                        )
                    })}
                </tr>
            )}
        </React.Fragment>
    )
}

export default TableHeader 