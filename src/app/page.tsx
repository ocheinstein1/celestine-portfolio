"use client";

import { useEffect, useState, useCallback } from "react";
import { portfolioData } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import AdminEditModal, { type Project } from "@/components/ui/AdminEditModal";

import Sidebar from "@/components/portfolio/Sidebar";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";

// ── Credentials (change these!) ──
const ADMIN_USERNAME = "celestine";
const ADMIN_PASSWORD = "celestine2026";
const STORAGE_KEY = "celestine_projects_v2";

function loadProjects(): Project[] {
  if (typeof window === "undefined") return portfolioData.projects as Project[];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return portfolioData.projects as Project[];
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects as Project[]);

  // Admin mode — session only, never persisted
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Edit modal
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);

  // ── Bootstrap — force-reset admin on every mount ──
  useEffect(() => {
    setIsAdmin(false);
    setProjects(loadProjects());
  }, []);

  // ── Persist projects ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // ── Scroll spy ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  // ── Open login: scroll to top so modal is perfectly centered ──
  const openLogin = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowLoginModal(true), 300);
  }, []);

  const closeLogin = useCallback(() => {
    setShowLoginModal(false);
    setUsernameInput("");
    setPwInput("");
    setLoginError("");
    setShowPw(false);
  }, []);

  // ── Admin auth ──
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
      pwInput === ADMIN_PASSWORD
    ) {
      setIsAdmin(true);
      closeLogin();
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    setEditingProject(undefined);
  }, []);

  // ── Project CRUD ──
  const saveProject = useCallback((updated: Project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === updated.id);
      if (exists) return prev.map((p) => (p.id === updated.id ? updated : p));
      return [updated, ...prev];
    });
    setEditingProject(undefined);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:px-24 lg:flex lg:gap-8">

      {/* ── LEFT: Sticky sidebar ── */}
      <Sidebar
        activeSection={activeSection}
        isAdmin={isAdmin}
        onLoginClick={openLogin}
        onLogoutClick={handleLogout}
      />

      {/* ── RIGHT: Scrollable content ── */}
      <main className="lg:w-[55%] py-12 lg:py-24">
        <AboutSection />
        <ExperienceSection isAdmin={isAdmin} />
        <ProjectsSection
          projects={projects}
          isAdmin={isAdmin}
          onAddProject={() => setEditingProject(null)}
          onEditProject={(id) => setEditingProject(projects.find(p => p.id === id) ?? null)}
          onDeleteProject={deleteProject}
        />
      </main>

      {/* ── Admin Login Modal ── */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeLogin} />
            <motion.form
              onSubmit={handleUnlock}
              className="relative z-10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: "#0d1f3c", border: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-electricBlue/10 border border-electricBlue/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-electricBlue" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">Admin Login</h3>
                    <p className="text-slate-500 text-xs">Restricted access</p>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="px-8 py-6 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => { setUsernameInput(e.target.value); setLoginError(""); }}
                      onFocus={() => setUsernameInput("")}
                      placeholder="Enter username"
                      autoFocus
                      autoComplete="off"
                      className={`w-full rounded-lg border ${loginError ? "border-red-500/50" : "border-white/10"} bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={pwInput}
                      onChange={(e) => { setPwInput(e.target.value); setLoginError(""); }}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className={`w-full rounded-lg border ${loginError ? "border-red-500/50" : "border-white/10"} bg-white/5 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                    {loginError}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-8 pb-8 flex gap-3">
                <button type="button" onClick={closeLogin}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-electricBlue text-navy text-sm font-bold hover:brightness-110 transition-all active:scale-95">
                  Login
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit/Add project modal (admin only) ── */}
      {isAdmin && editingProject !== undefined && (
        <AdminEditModal
          project={editingProject}
          onSave={saveProject}
          onClose={() => setEditingProject(undefined)}
        />
      )}
    </div>
  );
}
