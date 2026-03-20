export type ExamType = "YKS" | "LGS" | "Üniversite";

export type SilentGap = {
  concept: string;
  prerequisite: string;
  diagnosis: string;
  evidence: string;
  recommendedNextSteps: string[];
};

export type DailyTask = {
  task_description: string;
  estimated_minutes?: number;
  silent_gap_link?: string;
};

export type DailyPlanDay = {
  day_index: number; // 1..7
  title: string;
  guidance: string;
  tasks: DailyTask[];
};

export type AnalysisResult = {
  mental_state_summary: string;
  behavioral_findings: string[];
  silent_gaps: SilentGap[];
  daily_plan: DailyPlanDay[];
  score: number; // 0..100
};

export type AnalysisRouteState = {
  target_exam: ExamType;
  reportText: string;
};

