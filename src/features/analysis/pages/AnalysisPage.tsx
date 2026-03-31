import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analyzeWeeklyReport } from "../lib/analyzeWeeklyReport";
import type { AnalysisResult, AnalysisRouteState, SilentGap } from "../types";
import type { PlanRouteState } from "../../plan/types";

const PROCESS_MESSAGES = [
  "Haftanı adım adım inceliyoruz...",
  "Seni en çok zorlayan noktalara bakıyoruz...",
  "Anlattıklarını sade bir özet haline getiriyoruz...",
  "Son dokunuş: 7 günlük planını hazırlıyoruz..."
];

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-6 w-6 animate-spin rounded-full border-2 border-[#00a896]/20 border-t-[#00a896]" />
        <div>
          <div className="text-lg font-semibold text-[#1a3b66]">Yükleniyor...</div>
          <div className="mt-1 text-base text-slate-600">{message}</div>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-[#00a896]/40" />
      </div>
    </div>
  );
}

function getSubjectLabel(gap: SilentGap) {
  if (gap.subject && gap.subject.trim()) return gap.subject.trim();
  const concept = gap.concept ?? "";
  const parts = concept.split(/[:\-|]/).map((v) => v.trim()).filter(Boolean);
  return parts[0] ?? "Genel";
}

export function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? {}) as Partial<AnalysisRouteState>;

  const targetExam = routeState.target_exam;
  const reportText = routeState.reportText;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const canStart = useMemo(() => {
    return typeof targetExam === "string" && typeof reportText === "string" && reportText.trim().length > 0;
  }, [targetExam, reportText]);

  useEffect(() => {
    if (!canStart) {
      navigate("/input", { replace: true });
    }
  }, [canStart, navigate]);

  useEffect(() => {
    if (status !== "loading") return;
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % PROCESS_MESSAGES.length);
    }, 1400);
    return () => window.clearInterval(interval);
  }, [status]);

  async function handleAnalyzeClick() {
    if (!canStart || status === "loading") return;
    setStatus("loading");
    setErrorText("");
    setResult(null);
    setCheckedSteps({});
    setMessageIndex(0);
    try {
      const analyzed = await analyzeWeeklyReport({ target_exam: targetExam!, reportText: reportText! });
      setResult(analyzed);
      setStatus("success");
    } catch (err: any) {
      setErrorText(err?.message ?? "Beklenmeyen bir hata oluştu.");
      setStatus("error");
    }
  }

  const gapsBySubject = useMemo(() => {
    if (!result) return [];
    const grouped = new Map<string, SilentGap[]>();
    result.silent_gaps.forEach((gap) => {
      const subject = getSubjectLabel(gap);
      const current = grouped.get(subject) ?? [];
      current.push(gap);
      grouped.set(subject, current);
    });
    return Array.from(grouped.entries());
  }, [result]);

  return (
    <div className="space-y-7">
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="text-2xl font-bold text-[#1a3b66]">Haftanı birlikte değerlendiriyoruz</div>
        <div className="mt-2 text-base text-slate-600">
          Kısa bir beklemeden sonra sana uygun önerileri ve planı göstereceğiz.
        </div>
      </div>

      {status === "idle" ? (
        <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
          <div className="mt-4">
            <button
              type="button"
              className="rounded-xl bg-[#00a896] px-5 py-3 text-base font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-[#00897e]"
              onClick={handleAnalyzeClick}
            >
              Analizi başlat
            </button>
          </div>
        </div>
      ) : null}

      {status === "loading" ? (
        <LoadingCard message={PROCESS_MESSAGES[messageIndex]} />
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
          <div className="text-lg font-semibold text-rose-900">Bir aksilik oldu.</div>
          <div className="mt-2 text-base text-rose-800">{errorText}</div>
          <div className="mt-4">
            <button
              className="rounded-xl bg-white px-4 py-2 text-base font-semibold text-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-slate-50"
              type="button"
              onClick={handleAnalyzeClick}
            >
              Tekrar dene
            </button>
          </div>
        </div>
      ) : null}

      {status === "success" && result ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
            <div className="text-xl font-semibold text-[#1a3b66]">Genel durum</div>
            <div className="mt-3 text-base leading-7 text-slate-700">
              {result.mental_state_summary}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
            <div className="text-xl font-semibold text-[#1a3b66]">Gözlemler</div>
            <div className="mt-3 grid gap-2">
              {result.behavioral_findings.map((t, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-base text-slate-700">
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {gapsBySubject.map(([subject, gaps]) => (
              <div key={subject} className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
                <div className="text-xl font-semibold text-[#1a3b66]">{subject}</div>
                <div className="mt-4 space-y-4">
                  {gaps.map((g, gapIdx) => (
                    <div key={`${subject}_${gapIdx}`} className="rounded-xl border border-slate-200 p-4">
                      <h3 className="text-lg font-semibold text-[#1a3b66]">{g.concept}</h3>
                      <div className="mt-1 text-base text-slate-600">Başlangıç noktası: {g.prerequisite}</div>
                      <div className="mt-2 text-base text-slate-700">{g.diagnosis}</div>
                      <blockquote className="mt-3 text-base italic text-slate-500">"{g.evidence}"</blockquote>
                      <div className="mt-4 text-lg font-semibold text-[#1a3b66]">Önerilen adımlar</div>
                      <div className="mt-3 space-y-2">
                        {g.recommendedNextSteps.map((step, stepIdx) => {
                          const key = `${subject}_${gapIdx}_${stepIdx}`;
                          const checked = !!checkedSteps[key];
                          return (
                            <label
                              key={key}
                              className={[
                                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                                checked
                                  ? "border-[#00a896]/40 bg-[#e6fffa]"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              ].join(" ")}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  setCheckedSteps((prev) => ({ ...prev, [key]: e.target.checked }));
                                }}
                                className="mt-1 h-4 w-4 accent-[#00a896]"
                              />
                              <span className={["text-base text-slate-700", checked ? "line-through" : ""].join(" ")}>
                                {step}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#ffbf00]/30 bg-[#ffbf00]/15 p-5">
            <div className="text-base text-[#1a3b66]">
              Küçük adımları işaretledikçe ilerlemeni daha net görebilirsin.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="rounded-xl bg-[#00a896] px-5 py-3 text-base font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-[#00897e]"
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

