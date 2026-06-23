"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

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
    <PageShell
      action={
        backHref ? (
          <Button asChild variant="outline">
            <Link href={backHref}>
              <ArrowLeft />
              {backLabel}
            </Link>
          </Button>
        ) : null
      }
      align="center"
      className={className}
      description={description}
      eyebrow={eyebrow}
      title={title}
    >
      {children}
    </PageShell>
  );
}
