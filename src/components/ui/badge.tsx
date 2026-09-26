import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-white shadow-2xs hover:bg-slate-800",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200/80",
        destructive:
          "border-transparent bg-rose-500 text-white shadow-2xs hover:bg-rose-600",
        outline: "border-slate-200 text-slate-700 bg-white",
        brand: "border-indigo-200/80 bg-indigo-50/80 text-indigo-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
