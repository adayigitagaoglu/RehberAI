import React from "react";
import { Link } from "react-router-dom";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f8f7] text-[#1a3b66]">
      <header className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8.5" stroke="#00A896" strokeWidth="1.8" />
                <path
                  d="M9.4 15.2L11.5 10.6L16.1 8.5L14 13.1L9.4 15.2Z"
                  fill="#00A896"
                />
                <circle cx="12" cy="12" r="1.2" fill="#00A896" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-xl font-bold text-[#1a3b66]">RehberAI</div>
              <div className="text-base text-slate-500">
                Çalışma yol arkadaşın
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-14 pt-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}

