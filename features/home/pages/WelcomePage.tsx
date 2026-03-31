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
    <div className="space-y-7">
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="text-2xl font-bold text-[#1a3b66]">Başlayalım, seni dinliyorum.</div>
        <div className="mt-3 text-base leading-7 text-slate-600">
          Bu hafta nasıl geçtiğini birlikte toparlayalım; sana uygun, gerçekçi
          bir 7 günlük çalışma planı oluşturalım.
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="text-xl font-semibold text-[#1a3b66]">Şu an odak noktan hangisi?</div>
        <div className="mt-5 grid gap-4">
          {EXAMS.map((e) => {
            const isActive = e.id === exam;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setExam(e.id)}
                className={[
                  "text-left rounded-xl border p-4 transition",
                  isActive
                    ? "border-[#00a896]/40 bg-[#00a896]/10"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-lg font-semibold text-[#1a3b66]">{e.label}</div>
                  {isActive ? (
                    <div className="rounded-full bg-[#00a896] px-3 py-1 text-base font-semibold text-white">
                      Seçili
                    </div>
                  ) : null}
                </div>
                <div className="mt-2 text-base text-slate-600">{e.hint}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#00a896] px-5 py-3 text-base font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:bg-[#00897e]"
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

