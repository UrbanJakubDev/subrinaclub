import { FooterFunctionType } from './types'

// Add utility function for number formatting
export const formatNumber = (value: any): string => {
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
        const num = Number(value)
        return num.toLocaleString('cs-CZ')
    }
    return value
}

// Helper functions for footer calculations
export const footerFunctions = {
    sum: (rows: any[], accessor: string) => {
        const total = rows.reduce((sum, row) => sum + (parseFloat(row.getValue(accessor)) || 0), 0)
        return `${total.toLocaleString('cs-CZ')}`
    },
    count: (rows: any[]) => {
        return `Počet: ${rows.length.toLocaleString('cs-CZ')}`
    },
    average: (rows: any[], accessor: string) => {
        if (rows.length === 0) return 'Průměr: 0'
        const total = rows.reduce((sum, row) => sum + (parseFloat(row.getValue(accessor)) || 0), 0)
        return `${(total / rows.length).toLocaleString('cs-CZ')}`
    },
}

// Helper function to get footer value
export const getFooterValue = (type: FooterFunctionType, props: any) => {
    const rows = props.table.getFilteredRowModel().rows
    const accessor = props.column.id

    return footerFunctions[type](rows, accessor)
} 