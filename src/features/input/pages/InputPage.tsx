import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AnalysisRouteState, ExamType } from "../../analysis/types";

export function InputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = (location.state ?? {}) as Partial<AnalysisRouteState>;

  const [targetExam, setTargetExam] = useState<ExamType>(
    (initialState.target_exam as ExamType) ??
      (localStorage.getItem("rehberai_target_exam") as ExamType | null) ??
      "YKS",
  );

  const [reportText, setReportText] = useState<string>(initialState.reportText ?? "");

  const canSubmit = useMemo(() => reportText.trim().length >= 20, [reportText]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="text-base font-semibold">Haftanı dök.</div>
        <div className="mt-1 text-sm text-slate-600">
          Ne kadar doğal anlatırsan analiz o kadar derin olur.
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-800">Hedef sınav</div>
          <div className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {targetExam}
          </div>
        </div>

        <label className="mt-4 block">
          <div className="text-sm font-semibold text-slate-800">Haftalık rapor</div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="mt-2 min-h-40 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder='Örnek: "Bu hafta çok yorgundum, matematikte logaritma sorularına bakınca içim daraldı. Hiç çalışamadım..."\n\nİstersen şu sorulara da değinebilirsin: Bu hafta seni en çok ne zorladı? Hangi konularda odaklanma sorunu yaşadın?'
          />
          <div className="mt-2 text-xs text-slate-600">
            En az 20 karakter yazmanı öneririm.
          </div>
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className={[
              "rounded-lg px-4 py-3 text-sm font-semibold shadow-md transition",
              canSubmit
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-slate-200 text-slate-600"
            ].join(" ")}
            disabled={!canSubmit}
            onClick={() => {
              navigate("/analysis", {
                state: { target_exam: targetExam, reportText } satisfies AnalysisRouteState
              });
            }}
          >
            Analiz için gönder
          </button>
        </div>
      </div>
    </div>
  );
}

