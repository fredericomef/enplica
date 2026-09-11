"use client";

import type { ReactNode } from "react";

import { DiagnosticProvider } from "@/contexts/DiagnosticContext";

export function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DiagnosticProvider>
      {children}
    </DiagnosticProvider>
  );
}