"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Plus, Loader2, Trash2, ExternalLink, Globe } from "lucide-react";

interface PreviewData {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  screenshot: string;
}

function ShimmerCard() {
  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/5 animate-pulse">
      <div className="h-48 bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/10" />
        </div>
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}

function PreviewCard({
  link,
  onRemove,
}: {
  link: PreviewData;
  onRemove: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const displayImage = !imgError && (link.screenshot || link.image);
  const hostname = (() => {
    try {
      return new URL(link.url).hostname.replace("www.", "");
    } catch {
      return link.url;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      className="group relative rounded-2xl border border-white/5 overflow-hidden bg-[#112240] hover:border-electricBlue/40 transition-all duration-300 flex flex-col shadow-lg hover:shadow-electricBlue/10 hover:shadow-xl"
    >
      {/* Screenshot Preview */}
      <div className="relative h-48 bg-navy/80 overflow-hidden flex-shrink-0">
        {displayImage ? (
          <img
            src={link.screenshot || link.image}
            alt={link.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy to-[#0d2035]">
            <Globe className="w-10 h-10 text-electricBlue/30" />
            <span className="text-xs text-gray-600 font-mono">{hostname}</span>
          </div>
        )}

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#112240] to-transparent pointer-events-none" />

        {/* Delete button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-7 h-7 bg-red-500/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:scale-110 z-10"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Favicon + Domain */}
        <div className="flex items-center gap-2 mb-2">
          {link.favicon ? (
            <img
              src={link.favicon}
              alt=""
              className="w-4 h-4 rounded-sm object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
          <span className="text-xs text-electricBlue/70 font-mono truncate">{hostname}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 leading-snug">
          {link.title || hostname}
        </h3>

        {/* Description */}
        {link.description && (
          <p className="text-xs text-gray-400 line-clamp-3 flex-grow leading-relaxed mb-4">
            {link.description}
          </p>
        )}

        {/* Visit Link */}
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-electricBlue hover:text-cyan-300 transition-colors group/link"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          Visit App
        </a>
      </div>
    </motion.div>
  );
}

export default function DynamicLinkGrid() {
  const [links, setLinks] = useState<PreviewData[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("celestine_app_links_v2");
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("celestine_app_links_v2", JSON.stringify(links));
  }, [links]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch preview");

      const newLink: PreviewData = {
        id: Date.now().toString(),
        url: data.url,
        title: data.title,
        description: data.description,
        image: data.image || "",
        favicon: data.favicon || "",
        screenshot: data.screenshot || data.image || "",
      };

      setLinks((prev) => [newLink, ...prev]);
      setInputUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to load preview. Check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 pt-20 border-t border-white/10" id="live-apps">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-electricBlue uppercase mb-2">
          Live Deployments
        </p>
        <h2 className="text-3xl font-display font-bold text-white mb-3">
          My Live <span className="text-electricBlue">Apps</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-lg">
          Paste any deployed URL below — a live screenshot and metadata preview will appear instantly.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddLink} className="flex gap-3 max-w-2xl mb-10">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LinkIcon className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://your-app.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electricBlue focus:bg-white/8 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputUrl.trim()}
          className="px-6 py-3.5 bg-electricBlue text-navy text-sm font-bold rounded-xl hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm mb-6 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          ⚠ {error}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isLoading && <ShimmerCard />}
          {links.map((link) => (
            <PreviewCard
              key={link.id}
              link={link}
              onRemove={() => setLinks((prev) => prev.filter((l) => l.id !== link.id))}
            />
          ))}
        </AnimatePresence>

        {!isLoading && links.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/8 rounded-2xl text-gray-600 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Globe className="w-6 h-6 text-electricBlue/30" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">No apps added yet</p>
              <p className="text-xs text-gray-600 mt-1">Paste a URL above to generate a live preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
