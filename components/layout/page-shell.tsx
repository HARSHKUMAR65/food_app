import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "start" | "center";
};

export function PageShell({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  align = "start",
}: PageShellProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <header
        className={cn(
          "flex flex-col gap-4",
          isCentered
            ? "items-center text-center"
            : "items-start justify-between md:flex-row md:items-end",
          headerClassName,
        )}
      >
        <div className={cn("space-y-2", isCentered && "max-w-2xl")}>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
      </header>

      {children}
    </div>
  );
}
