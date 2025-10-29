"use client"

import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react"
import { motion } from "motion/react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const getVisiblePages = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Swiss Grid Container */}
      <div className="max-w-4xl mx-auto">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          {/* Previous Controls */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="h-12 px-4 font-mono text-xs tracking-widest uppercase hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-3 w-3 mr-2" />
                First
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-12 px-6 font-mono text-xs tracking-widest uppercase hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3 w-3 mr-2" />
                Previous
              </Button>
            </motion.div>
          </div>

          {/* Page Numbers - Swiss Typography */}
          <div className="flex items-center gap-1">
            {visiblePages.map((page, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page === '...' ? (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <span className="text-muted-foreground font-mono text-lg tracking-wider">
                      ⋯
                    </span>
                  </div>
                ) : (
                  <Button
                    variant={page === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`
                      w-12 h-12 font-mono text-sm font-bold tracking-wider
                      ${page === currentPage 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-primary/10 text-foreground'
                      }
                      transition-all duration-200
                    `}
                  >
                    {page}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Next Controls */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-12 px-6 font-mono text-xs tracking-widest uppercase hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-2" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-12 px-4 font-mono text-xs tracking-widest uppercase hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Last
                <ChevronsRight className="h-3 w-3 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
