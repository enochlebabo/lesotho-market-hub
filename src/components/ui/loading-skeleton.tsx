
import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
)

export const CategoryCardSkeleton = () => (
  <div className="border rounded-lg p-6 text-center space-y-3">
    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
    <Skeleton className="h-5 w-24 mx-auto" />
    <Skeleton className="h-3 w-16 mx-auto" />
  </div>
)
