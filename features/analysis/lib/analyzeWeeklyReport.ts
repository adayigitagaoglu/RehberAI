import type { AnalysisResult } from "../types";

type AnalyzeInput = {
  target_exam: string;
  reportText: string;
};

export async function analyzeWeeklyReport(input: AnalyzeInput): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    let message = "Beklenmeyen bir hata oluştu.";
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await res.json()) as AnalysisResult;
}

