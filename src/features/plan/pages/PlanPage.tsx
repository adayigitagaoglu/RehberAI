import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PlanRouteState } from "../types";

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // 32-bit
  }
  return Math.abs(hash).toString(16);
}

export function PlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? {}) as Partial<PlanRouteState>;

  const analysisResult = routeState.analysisResult;
  const reportText = routeState.reportText;
  const targetExam = routeState.target_exam;

  const canStart = typeof reportText === "string" && !!analysisResult && typeof targetExam === "string";

  const planHash = useMemo(() => (reportText ? hashString(reportText) : "none"), [reportText]);
  const storageKey = useMemo(() => `rehberai_completion_v0_${planHash}`, [planHash]);

  const [lightModeDays, setLightModeDays] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    if (!canStart) {
      navigate("/input", { replace: true });
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [canStart, navigate, storageKey]);

  useEffect(() => {
    if (!canStart) return;
    localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [canStart, completed, storageKey]);

  if (!analysisResult) return null;

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="text-base font-semibold">7 günlük esnek plan</div>
        <div className="mt-1 text-sm text-slate-600">
          Küçük ama düzenli adımlarla ilerleyelim.
        </div>
      </div>

      <div className="space-y-4">
        {analysisResult.daily_plan.slice(0, 7).map((day, dayIdx) => {
          const dayNumber = day.day_index ?? dayIdx + 1;
          const isLight = !!lightModeDays[dayNumber];
          const tasks = day.tasks ?? [];
          const shownTasks = isLight ? tasks.slice(0, 1) : tasks;
          const dayCompleted = completed[dayNumber] ?? new Array(tasks.length).fill(false);

          return (
            <section key={dayNumber} className="rounded-lg bg-white p-5 shadow-md sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Gün {dayNumber}: {day.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{day.guidance}</div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-100"
                  onClick={() => {
                    setLightModeDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
                  }}
                >
                  {isLight ? "Bugünü normale al" : "Bugünü Hafiflet"}
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {shownTasks.length === 0 ? (
                  <div className="text-sm text-slate-500">Bu güne görev eklenemedi.</div>
                ) : null}

                {shownTasks.map((t, taskIdx) => {
                  const actualIdx = isLight ? taskIdx : taskIdx; // kept for clarity
                  const isChecked = !!dayCompleted[actualIdx];
                  return (
                    <label
                      key={`${dayNumber}_${taskIdx}`}
                      className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800">{t.task_description}</div>
                        {typeof t.estimated_minutes === "number" ? (
                          <div className="mt-1 text-xs text-slate-600">
                            Hedef: {t.estimated_minutes} dk
                          </div>
                        ) : null}
                        {t.silent_gap_link ? (
                          <div className="mt-1 text-xs text-slate-600">
                            İlgili nokta: {t.silent_gap_link}
                          </div>
                        ) : null}
                        {isLight ? (
                          <div className="mt-1 text-xs text-slate-600">
                            Hafif mod: bugün için sadece minimum hedef.
                          </div>
                        ) : null}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = { ...completed };
                          const prevArr = next[dayNumber] ?? new Array(tasks.length).fill(false);
                          prevArr[actualIdx] = e.target.checked;
                          next[dayNumber] = prevArr;
                          setCompleted(next);
                        }}
                        className="mt-1 h-4 w-4 accent-emerald-600"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">İleriye taşı</div>
            <div className="mt-1 text-sm text-slate-600">
              Bu hafta bitince yeniden yaz, bir sonraki planını birlikte çıkaralım.
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
            onClick={() => navigate("/input")}
          >
            Yeni rapor
          </button>
        </div>
      </div>
    </div>
  );
}

