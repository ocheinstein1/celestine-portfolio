"use client";

import { portfolioData } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import { ArrowUpRight, FileText, Download, ExternalLink, Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

const RESUME_KEY = "celestine_resume_url";

interface ExperienceSectionProps {
  isAdmin?: boolean;
}

export default function ExperienceSection({ isAdmin }: ExperienceSectionProps) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  // Load saved resume URL
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RESUME_KEY);
      if (saved) setResumeUrl(saved);
    } catch (_) {}
  }, []);

  const saveUrl = () => {
    const url = inputVal.trim();
    setResumeUrl(url);
    localStorage.setItem(RESUME_KEY, url);
    setEditing(false);
  };

  const cancelEdit = () => {
    setInputVal(resumeUrl);
    setEditing(false);
  };

  const startEdit = () => {
    setInputVal(resumeUrl);
    setEditing(true);
  };

  return (
    <section id="experience" className="mb-16 scroll-mt-16 lg:mb-36 lg:scroll-mt-24">
      <SectionLabel label="Experience" />
      <ol className="group/list flex flex-col gap-12">
        {portfolioData.experience.map((exp) => (
          <li key={exp.id}>
            <div className="group relative flex gap-5 py-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
              <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
              <div className="z-10 mt-1 w-[120px] flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 pt-1">{exp.date}</div>
              <div className="z-10 flex-1 min-w-0">
                <h3 className="font-medium leading-snug">
                  <a className="group/link inline-flex items-baseline gap-1 text-slate-200 hover:text-electricBlue transition-colors text-base font-medium" href="#">
                    <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                    {exp.title}
                    <span className="text-slate-500 mx-1">·</span>
                    {exp.company}
                    <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-normal">{exp.description}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {exp.tech.map((t) => (
                    <li key={t} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-electricBlue">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* ── Resume Card ── */}
      <div className="mt-14">

        {/* Admin: URL editor */}
        {isAdmin && (
          <div className="mb-5 rounded-xl border border-electricBlue/20 bg-electricBlue/5 p-4">
            <p className="text-xs font-semibold text-electricBlue uppercase tracking-widest mb-3 flex items-center gap-2">
              <Pencil className="w-3.5 h-3.5" /> Admin — Set Résumé Link
            </p>
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Paste Google Drive or PDF link..."
                  autoFocus
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors"
                />
                <button
                  onClick={saveUrl}
                  className="p-2 rounded-lg bg-electricBlue text-navy hover:brightness-110 transition"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400 truncate flex-1">
                  {resumeUrl || <span className="italic text-slate-600">No résumé URL set yet</span>}
                </p>
                <button
                  onClick={startEdit}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-electricBlue/30 text-electricBlue text-xs hover:bg-electricBlue/10 transition"
                >
                  <Pencil className="w-3 h-3" /> {resumeUrl ? "Change" : "Add Link"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Visitor-facing resume card */}
        {resumeUrl ? (
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 transition-all hover:border-electricBlue/30 hover:shadow-[0_0_30px_rgba(94,234,212,0.07)]">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-electricBlue/5 blur-3xl group-hover:bg-electricBlue/10 transition-colors" />

            <div className="relative flex items-start gap-5">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-electricBlue/10 border border-electricBlue/20 flex items-center justify-center group-hover:bg-electricBlue/15 transition-colors">
                <FileText className="w-6 h-6 text-electricBlue" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-200 font-semibold text-base leading-snug">Celestine Oche — Résumé</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                  Full professional background, skills, and achievements. Available to view or download.
                </p>

                {/* Action buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-electricBlue text-navy text-sm font-semibold hover:brightness-110 transition-all active:scale-95 shadow-md shadow-electricBlue/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Résumé
                  </a>
                  <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:border-electricBlue/40 hover:text-electricBlue transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback plain link when no URL set
          !isAdmin && (
            <a
              className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-electricBlue focus-visible:text-electricBlue group/link text-base transition-colors"
              href="#"
              aria-label="View Full Résumé"
            >
              View Full Résumé
              <ArrowUpRight className="inline-block h-4 w-4 shrink-0 ml-1 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
            </a>
          )
        )}
      </div>
    </section>
  );
}
