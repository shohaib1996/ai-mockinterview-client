"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meta } from "@/types";

interface CustomPaginationProps {
  meta: Meta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
}

export function CustomPagination({
  meta,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
  limitOptions = [5, 10, 20, 50],
}: CustomPaginationProps) {
  const { page, limit, total } = meta;
  const totalPages = Math.ceil(total / limit);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // User wants 5 visible pages

    if (totalPages <= maxVisiblePages) {
      // If total pages are 5 or less, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If total pages are more than 5, always show 1, 2, 3, 4, 5
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side - Limit selector */}
      <div className="flex flex-1 items-center gap-2">
        {showLimitSelector && onLimitChange && (
          <>
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => onLimitChange(Number.parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </>
        )}
      </div>

      {/* Middle - Entry count */}
      <div className="text-sm text-muted-foreground flex-1 text-center">
        Showing {startEntry} to {endEntry} of {total} entries
      </div>

      {/* Right side - Pagination */}
      <div className="flex-1">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) onPageChange(page - 1);
                  }}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageNumbers.map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) onPageChange(page + 1);
                  }}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
