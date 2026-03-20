import type { AnalysisResult, ExamType } from "../analysis/types";

export type PlanRouteState = {
  target_exam: ExamType;
  reportText: string;
  analysisResult: AnalysisResult;
};

