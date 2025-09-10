"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReactNode } from "react"

export interface TableColumn<T = any> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

export interface TableAction<T = any> {
  label: string
  onClick: (item: T) => void
  icon?: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

interface CustomTableProps<T = any> {
  title?: string
  columns: TableColumn<T>[]
  data: T[]
  actions?: TableAction<T>[]
  emptyMessage?: string
  loading?: boolean
}

export function CustomTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  actions = [],
  emptyMessage = "No data found",
  loading = false,
}: CustomTableProps<T>) {
  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions?.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns?.length + (actions?.length > 0 ? 1 : 0)} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns?.length + (actions?.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                  {actions?.length > 0 && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 hover:bg-accent hover:text-accent-foreground ${action.className || ""}`}
                            title={action.label}
                          >
                            {action.icon}
                            <span className="sr-only">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
