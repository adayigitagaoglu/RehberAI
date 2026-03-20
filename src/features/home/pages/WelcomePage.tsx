import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ExamType = "YKS" | "LGS" | "Üniversite";

const EXAMS: Array<{ id: ExamType; label: string; hint: string }> = [
  { id: "YKS", label: "YKS", hint: "TYT / AYT hedefin" },
  { id: "LGS", label: "LGS", hint: "LGS hazırlığı" },
  { id: "Üniversite", label: "Üniversite", hint: "Vize / final" }
];

export function WelcomePage() {
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamType>("YKS");

  useEffect(() => {
    const saved = localStorage.getItem("rehberai_target_exam") as ExamType | null;
    if (saved) setExam(saved);
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="text-lg font-semibold">Seni dinliyorum.</div>
        <div className="mt-2 text-sm leading-6 text-slate-600">
          Bu uygulama haftalık raporlarını analiz edip sana suçluluk yaratmadan
          uygulanabilir bir 7 günlük plan çıkarır.
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-md sm:p-6">
        <div className="text-sm font-semibold text-slate-800">Önceliğin hangisi?</div>
        <div className="mt-4 grid gap-3">
          {EXAMS.map((e) => {
            const isActive = e.id === exam;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setExam(e.id)}
                className={[
                  "text-left rounded-lg border p-4 transition",
                  isActive
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold">{e.label}</div>
                  {isActive ? (
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                      Seçili
                    </div>
                  ) : null}
                </div>
                <div className="mt-1 text-xs text-slate-600">{e.hint}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
            onClick={() => {
              localStorage.setItem("rehberai_target_exam", exam);
              navigate("/input");
            }}
          >
            Haftamı yazmaya başlayalım
          </button>
        </div>
      </div>
    </div>
  );
}

