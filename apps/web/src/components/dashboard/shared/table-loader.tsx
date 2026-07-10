import {
  Skeleton,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
  cn,
} from '@observo/ui'
import type { ReactNode } from 'react'

export type TableLoaderColumn = {
  header: ReactNode
  headerClassName?: string
  cellClassName?: string
  /** Skeleton shape for this column. Defaults to `h-4 w-full max-w-48`. */
  skeletonClassName?: string
}

type TableLoaderProps = {
  columns: Array<TableLoaderColumn>
  rows?: number
  /** Accessible name, e.g. "Loading API keys" */
  label?: string
  className?: string
}

const DEFAULT_SKELETON = 'h-4 w-full max-w-48'

export function TableLoader({
  columns,
  rows = 4,
  label = 'Loading table data',
  className,
}: TableLoaderProps) {
  return (
    <div
      className={cn('surface-card overflow-hidden rounded-xl', className)}
      aria-busy="true"
      aria-label={label}
    >
      <Table>
        <THead>
          <tr>
            {columns.map((column, index) => (
              <Th key={index} className={column.headerClassName}>
                {column.header}
              </Th>
            ))}
          </tr>
        </THead>
        <TBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <Td key={columnIndex} className={column.cellClassName}>
                  <Skeleton
                    className={column.skeletonClassName ?? DEFAULT_SKELETON}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
