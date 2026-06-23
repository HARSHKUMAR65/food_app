"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OrderFlowShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  className?: string;
};

export function OrderFlowShell({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  children,
  className,
}: OrderFlowShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
        {backHref ? (
          <Button asChild variant="outline">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        ) : null}
      </header>
      {children}
    </div>
  );
}
