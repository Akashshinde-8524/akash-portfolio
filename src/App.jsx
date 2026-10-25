import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider, AuthProvider } from "./context";
import { Home } from "./pages/Home";

// Code-split inner public pages (exact same public portfolio)
const IntroPage = lazy(() => import("./pages/IntroPage").then((m) => ({ default: m.IntroPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage").then((m) => ({ default: m.ExperiencePage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() =>
  import("./pages/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage }))
);
const SkillsPage = lazy(() => import("./pages/SkillsPage").then((m) => ({ default: m.SkillsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));

// Code-split Private Admin (Isolated and strictly protected)
const LoginPage = lazy(() => import("./admin/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const ProtectedRoute = lazy(() => import("./admin/components/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })));

function RouteFallback() {
  return (
    <p style={{ padding: "var(--space-8) var(--gutter)", color: "var(--color-text-muted)" }}>Loading…</p>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public Portfolio Routes (100% untouched) */}
              <Route path="/" element={<Home />} />
              <Route path="/intro" element={<IntroPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Private Admin Dashboard Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </PortfolioProvider>
  );
}

export default App;
