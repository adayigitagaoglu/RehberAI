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
    <div className="space-y-7">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="text-xl font-semibold text-[#1a3b66]">Haftanı içinden geldiği gibi anlat; sana uygun bir plan yapalım.</div>
        <div className="mt-2 text-base text-slate-600">
          Ne kadar detaylı yazarsan o kadar iyi yol haritası yaparız.
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-[#1a3b66]">Hedef sınav</div>
          <div
            className={[
              "rounded-full px-4 py-1.5 text-base font-semibold",
              targetExam === "Üniversite" ? "bg-[#00a896] text-white" : "bg-slate-100 text-slate-700"
            ].join(" ")}
          >
            {targetExam}
          </div>
        </div>

        <label className="mt-5 block">
          <div className="text-lg font-semibold text-[#1a3b66]">Haftalık notun</div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            spellCheck={false}
            lang="tr"
            rows={10}
            className="mt-3 min-h-56 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus:border-[#00a896]/50 focus:outline-none focus:ring-2 focus:ring-[#00a896]/20"
            placeholder={'Örnek: "Bu hafta çok yorgundum. Matematikte logaritma sorularına başlayınca zorlandım ve düzenim bozuldu. "\n\nİstersen şunlardan da bahsedebilirsin: \nBu hafta seni en çok ne zorladı? Hangi derste takıldın?'}
          />
          <div className="mt-2 text-base italic text-slate-500">
            En az 20 karakter yazdığında daha net öneriler alırsın.
          </div>
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className={[
              "rounded-xl px-5 py-3 text-base font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition",
              canSubmit
                ? "bg-[#00a896] text-white hover:bg-[#00897e]"
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

