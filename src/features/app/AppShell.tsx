import React from "react";
import { Link } from "react-router-dom";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 shadow-md" />
            <div className="leading-tight">
              <div className="text-base font-semibold">RehberAI</div>
              <div className="text-xs text-slate-600">
                Yargılamayan eğitim koçu
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-12 pt-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}

