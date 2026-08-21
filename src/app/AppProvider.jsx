import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./AppLayout.jsx";
import { PageSpinner } from "../shared/ui/PageSpinner.jsx";

const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage.jsx"));
const PortfolioPage = lazy(() => import("../features/portfolio/PortfolioPage.jsx"));
const TradesPage = lazy(() => import("../features/trades/TradesPage.jsx"));
const SignalsPage = lazy(() => import("../features/signals/SignalsPage.jsx"));

/**
 * Root application provider - sets up routing and lazy page loading.
 */
export function AppProvider() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="trades" element={<TradesPage />} />
            <Route path="signals" element={<SignalsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
