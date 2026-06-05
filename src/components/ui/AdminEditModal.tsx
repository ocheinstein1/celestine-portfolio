"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Project {
  id: string;
  title: string;
  link: string;
  description: string;
  tech: string[];
  image: string;
}

interface AdminEditModalProps {
  project?: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

export default function AdminEditModal({ project, onSave, onClose }: AdminEditModalProps) {
  const isNew = !project;
  const [form, setForm] = useState<Project>(
    project ?? {
      id: Date.now().toString(),
      title: "",
      link: "",
      description: "",
      tech: [],
      image: "",
    }
  );
  const [techInput, setTechInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (key: keyof Project, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Auto-fetch preview from URL — fills title, description and thumbnail
  const fetchPreview = async () => {
    const url = form.link.trim();
    if (!url || url === "#") return;
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch preview");
      setForm((f) => ({
        ...f,
        title: f.title || data.title || f.title,
        description: f.description || data.description || f.description,
        image: data.screenshot || data.image || f.image,
      }));
    } catch (err: any) {
      setFetchError(err.message || "Could not load preview.");
    } finally {
      setIsFetching(false);
    }
  };

  const addTag = () => {
    const tag = techInput.trim();
    if (tag && !form.tech.includes(tag)) {
      setForm((f) => ({ ...f, tech: [...f.tech, tag] }));
    }
    setTechInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tech: f.tech.filter((t) => t !== tag) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, id: form.id || Date.now().toString() });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-lg bg-[#112240] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
            <h2 className="text-lg font-bold text-white">
              {isNew ? "Add New Project" : "Edit Project"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form — scrollable */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 overflow-y-auto">

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Project Name *
              </label>
              <input
                ref={firstInput}
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. NovaFlow"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors"
              />
            </div>

            {/* Live URL + Auto-fetch button */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Live URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => { set("link", e.target.value); setFetchError(""); }}
                  placeholder="https://your-app.com"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors"
                />
                <button
                  type="button"
                  onClick={fetchPreview}
                  disabled={isFetching || !form.link.trim() || form.link === "#"}
                  title="Auto-fetch title, description & screenshot from the URL"
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-electricBlue/10 border border-electricBlue/30 text-electricBlue text-xs font-medium hover:bg-electricBlue/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  {isFetching
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Fetching...</>
                    : <><Sparkles className="w-3.5 h-3.5" />Auto-fill</>
                  }
                </button>
              </div>
              {fetchError && <p className="mt-1.5 text-xs text-red-400">{fetchError}</p>}
              <p className="mt-1.5 text-xs text-slate-600">Click Auto-fill to fetch screenshot, title & description from the URL.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What does this project do?"
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors resize-none"
              />
            </div>

            {/* Thumbnail — shows preview if image exists */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Thumbnail
              </label>
              {form.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-white/10" style={{ aspectRatio: "16/9", maxHeight: "120px" }}>
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover object-top" />
                </div>
              )}
              <input
                type="text"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="Auto-filled by URL fetch, or paste manually"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Tech Stack
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="e.g. React"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electricBlue transition-colors"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-electricBlue/20 text-electricBlue rounded-lg border border-electricBlue/30 hover:bg-electricBlue/30 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tech.map((tag) => (
                  <span
                    key={tag}
                    className="group flex items-center gap-1 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-electricBlue"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-electricBlue text-navy text-sm font-bold hover:bg-cyan-400 transition-all active:scale-95"
              >
                {isNew ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
