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
    <div className="space-y-7">
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="text-2xl font-bold text-[#1a3b66]">7 günlük esnek plan</div>
        <div className="mt-2 text-base text-slate-600">
          Küçük ama düzenli adımlarla ilerleyelim.
        </div>
      </div>

      <div className="space-y-5">
        {analysisResult.daily_plan.slice(0, 7).map((day, dayIdx) => {
          const dayNumber = day.day_index ?? dayIdx + 1;
          const isLight = !!lightModeDays[dayNumber];
          const tasks = day.tasks ?? [];
          const dayCompleted = completed[dayNumber] ?? new Array(tasks.length).fill(false);
          const visibleTaskIndexes = isLight
            ? (() => {
                const completedIndexes = tasks
                  .map((_, idx) => idx)
                  .filter((idx) => !!dayCompleted[idx]);
                const firstUncompletedIndex = tasks.findIndex((_, idx) => !dayCompleted[idx]);
                return firstUncompletedIndex === -1
                  ? completedIndexes
                  : [...completedIndexes, firstUncompletedIndex].sort((a, b) => a - b);
              })()
            : tasks.map((_, idx) => idx);

          return (
            <section key={dayNumber} className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-[#1a3b66]">
                    Gün {dayNumber}: {day.title}
                  </h3>
                  <div className="mt-2 text-base leading-7 text-slate-600">{day.guidance}</div>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-[#00a896]/40 bg-[#00a896]/10 px-4 py-2 text-base font-semibold text-[#006d64] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-[#00a896]/15"
                  onClick={() => {
                    setLightModeDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
                  }}
                >
                  {isLight ? "Bugünü normale al" : "Bugünü Hafiflet"}
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {visibleTaskIndexes.length === 0 ? (
                  <div className="text-base text-slate-500">Bu güne görev eklenemedi.</div>
                ) : null}

                {visibleTaskIndexes.map((actualIdx) => {
                  const t = tasks[actualIdx];
                  const isChecked = !!dayCompleted[actualIdx];
                  return (
                    <label
                      key={`${dayNumber}_${actualIdx}`}
                      className={[
                        "flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-4 transition",
                        isChecked
                          ? "border-[#00a896]/30 bg-[#e6fffa]"
                          : "border-slate-100 bg-slate-50"
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <div
                          className={[
                            "text-base font-semibold",
                            isChecked ? "text-[#9ca3af] line-through" : "text-[#1a3b66]"
                          ].join(" ")}
                        >
                          {t.task_description}
                        </div>
                        {typeof t.estimated_minutes === "number" ? (
                          <div
                            className={[
                              "mt-1 text-base",
                              isChecked ? "text-[#9ca3af] line-through" : "text-slate-600"
                            ].join(" ")}
                          >
                            Hedef: {t.estimated_minutes} dk
                          </div>
                        ) : null}
                        {t.silent_gap_link ? (
                          <div
                            className={[
                              "mt-1 text-base",
                              isChecked ? "text-[#9ca3af] line-through" : "text-slate-600"
                            ].join(" ")}
                          >
                            İlgili nokta: {t.silent_gap_link}
                          </div>
                        ) : null}
                        {isLight ? (
                          <div className="mt-1 text-base text-slate-600">
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
                        className="mt-1 h-4 w-4 accent-[#00a896]"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-[#1a3b66]">İleriye taşı</div>
            <div className="mt-2 text-base text-slate-600">
              Bu hafta bitince yeniden yaz, bir sonraki planını birlikte çıkaralım.
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-[#00a896] px-5 py-3 text-base font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-[#00897e]"
            onClick={() => navigate("/input")}
          >
            Yeni rapor
          </button>
        </div>
      </div>
    </div>
  );
}

