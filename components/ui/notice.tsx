import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NoticeVariant = "default" | "error" | "success";

type NoticeProps = {
  children: ReactNode;
  variant?: NoticeVariant;
  className?: string;
};

const noticeClasses: Record<NoticeVariant, string> = {
  default: "border-border bg-card text-muted-foreground",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
};

export function Notice({ children, variant = "default", className }: NoticeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-6",
        noticeClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
