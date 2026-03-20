import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analyzeWeeklyReport } from "../lib/analyzeWeeklyReport";
import type { AnalysisResult, AnalysisRouteState } from "../types";
import type { PlanRouteState } from "../../plan/types";

const PROCESS_MESSAGES = [
  "Geçen haftaki odak süren kıyaslanıyor...",
  "Matematik hiyerarşisinde sessiz kopuşlar aranıyor...",
  "Mental durumun için şefkatli bir dil kurgulanıyor...",
  "7 gün için esnek plan hazırlanıyor..."
];

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
        <div>
          <div className="text-sm font-semibold">Yükleniyor…</div>
          <div className="mt-1 text-sm text-slate-600">{message}</div>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-200" />
      </div>
    </div>
  );
}

export function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? {}) as Partial<AnalysisRouteState>;

  const targetExam = routeState.target_exam;
  const reportText = routeState.reportText;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [messageIndex, setMessageIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  const canStart = useMemo(() => {
    return typeof targetExam === "string" && typeof reportText === "string" && reportText.trim().length > 0;
  }, [targetExam, reportText]);

  useEffect(() => {
    if (!canStart) {
      navigate("/input", { replace: true });
      return;
    }

    let interval: number | undefined;
    interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % PROCESS_MESSAGES.length);
    }, 1400);

    (async () => {
      try {
        const analyzed = await analyzeWeeklyReport({ target_exam: targetExam!, reportText: reportText! });
        setResult(analyzed);
        setStatus("success");
      } catch (err: any) {
        setErrorText(err?.message ?? "Beklenmeyen bir hata oluştu.");
        setStatus("error");
      } finally {
        if (interval) window.clearInterval(interval);
      }
    })();

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [canStart, navigate, reportText, targetExam]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="text-base font-semibold">Analiz ve teşhis</div>
        <div className="mt-1 text-sm text-slate-600">
          Süreci acele etmiyoruz; verileri şefkatli bir çerçevede tarıyoruz.
        </div>
      </div>

      {status === "loading" ? (
        <LoadingCard message={PROCESS_MESSAGES[messageIndex]} />
      ) : null}

      {status === "error" ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 shadow-md sm:p-6">
          <div className="text-sm font-semibold text-rose-900">Üzgünüz…</div>
          <div className="mt-2 text-sm text-rose-800">{errorText}</div>
          <div className="mt-4">
            <button
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-md transition hover:bg-slate-50"
              type="button"
              onClick={() => navigate("/input")}
            >
              Tekrar dene
            </button>
          </div>
        </div>
      ) : null}

      {status === "success" && result ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-800">Mental durum</div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                Uyum skoru: {Math.round(result.score)}/100
              </div>
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-700">
              {result.mental_state_summary}
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
            <div className="text-sm font-semibold text-slate-800">Davranışsal tespitler</div>
            <div className="mt-3 grid gap-2">
              {result.behavioral_findings.map((t, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
            <div className="text-sm font-semibold text-slate-800">Sessiz kopuş teşhisleri</div>
            <div className="mt-3 space-y-3">
              {result.silent_gaps.map((g, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-900">{g.concept}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">Önkoşul: {g.prerequisite}</div>
                  <div className="mt-2 text-sm text-slate-700">{g.diagnosis}</div>
                  <div className="mt-2 text-xs text-slate-600">{g.evidence}</div>
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700">Önerilen sonraki adımlar</div>
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                      {g.recommendedNextSteps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
              onClick={() => {
                navigate("/plan", {
                  state: {
                    target_exam: targetExam!,
                    reportText: reportText!,
                    analysisResult: result
                  } satisfies PlanRouteState
                });
              }}
            >
              7 günlük planı gör
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

