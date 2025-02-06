import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        lost:
          "border-transparent !border-red-600 text-red-700 hover:bg-primary/80",
        '0-30':
          "border-transparent !border-yellow-600 text-yellow-600 hover:bg-destructive/80",
        '30-70':
          "border-transparent !border-blue-600 text-blue-600 hover:bg-destructive/80",
        '70-100':
          "border-transparent !border-green-600 text-green-600 hover:bg-destructive/80",
        deal:
          "border-transparent !border-purple-600 text-purple-600 hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "lost",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function SalesBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { SalesBadge, badgeVariants }
