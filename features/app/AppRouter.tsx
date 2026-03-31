import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { WelcomePage } from "../home/pages/WelcomePage";
import { InputPage } from "../input/pages/InputPage";
import { AnalysisPage } from "../analysis/pages/AnalysisPage";
import { PlanPage } from "../plan/pages/PlanPage";

export function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

