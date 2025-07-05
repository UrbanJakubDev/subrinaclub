import { ColumnDef, Table, Header, HeaderGroup, Row } from '@tanstack/react-table'

export interface TableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    tableName: string
    addBtn?: boolean
    onAddClick?: () => void
    enableRowSelection?: boolean
    onSelectionChange?: (rows: T[]) => void
    bulkActions?: {
        label: string
        onClick: (selectedRows: T[]) => void
    }[]
    updatedTime?: string
    customToolbarContent?: React.ReactNode
}

export interface TableHeaderProps<T> {
    headerGroup: HeaderGroup<T>
    table: Table<T>
}

export interface SortIconProps<T> {
    header: Header<T, unknown>
}

export interface PaginationProps<T> {
    table: Table<T>
}

export interface TableToolbarProps<T> {
    table: Table<T>
    tableName: string
    addBtn?: boolean
    onAddClick?: () => void
    bulkActions?: {
        label: string
        onClick: (selectedRows: T[]) => void
    }[]
    updatedTime?: string
    customToolbarContent?: React.ReactNode
}

export interface TableRowProps<T> {
    row: Row<T>
    header: HeaderGroup<T>
}

export interface IndeterminateCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    indeterminate?: boolean
}

// Add built-in footer function types
export type FooterFunctionType = 'sum' | 'count' | 'average'

// Extend ColumnDef type to include formatNumber option
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends unknown, TValue> {
        formatNumber?: boolean
    }
} 