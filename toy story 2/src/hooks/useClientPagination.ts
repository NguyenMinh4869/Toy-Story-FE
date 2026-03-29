import { useMemo } from 'react'

export const useClientPagination = <T,>(items: T[], currentPage: number, pageSize: number) => {
  return useMemo(() => {
    const safePageSize = Math.max(1, pageSize)
    const totalPages = Math.max(1, Math.ceil(items.length / safePageSize))
    const safePage = Math.min(Math.max(1, currentPage), totalPages)
    const start = (safePage - 1) * safePageSize
    const paginatedItems = items.slice(start, start + safePageSize)

    return {
      paginatedItems,
      totalPages,
      currentPage: safePage
    }
  }, [items, currentPage, pageSize])
}
