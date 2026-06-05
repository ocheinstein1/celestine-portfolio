import { Link2, Plus, Loader2, Trash2, ArrowUpRight } from "lucide-react";
import SectionLabel from "./SectionLabel";

export interface PreviewCard {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  favicon?: string;
  screenshot?: string;
}

interface LiveAppsSectionProps {
  previews: PreviewCard[];
  inputUrl: string;
  isLoading: boolean;
  previewError: string;
  isAdmin: boolean;
  onInputUrlChange: (val: string) => void;
  onAddPreview: (e: React.FormEvent) => void;
  onDeletePreview: (id: string) => void;
}

export default function LiveAppsSection({
  previews, inputUrl, isLoading, previewError, isAdmin,
  onInputUrlChange, onAddPreview, onDeletePreview
}: LiveAppsSectionProps) {
  return (
    <section id="apps" className="mb-16 scroll-mt-16 lg:mb-36 lg:scroll-mt-24">
      <SectionLabel label="Live Apps" />

      {/* URL input — admin only */}
      {isAdmin && (
        <>
          <p className="mb-6 text-sm">Paste a URL to any deployed app — it will be auto-previewed here.</p>
          <form onSubmit={onAddPreview} className="flex gap-3 mb-8">
            <div className="relative flex-grow">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => onInputUrlChange(e.target.value)}
                placeholder="https://your-app.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-electricBlue focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="flex items-center gap-2 rounded-lg bg-electricBlue px-5 py-3 text-sm font-semibold text-navy hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" />Add</>}
            </button>
          </form>
          {previewError && <p className="mb-4 text-sm text-red-400">{previewError}</p>}
        </>
      )}

      {previews.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-800 py-12 text-center text-slate-600">
          <Link2 className="mx-auto mb-3 w-7 h-7 opacity-30" />
          <p className="text-sm">{isAdmin ? "No apps added yet." : "No live apps showcased yet."}</p>
        </div>
      ) : (
        <ol className="group/list flex flex-col gap-12">
          {previews.map((card) => (
            <li key={card.id}>
              <div className="group relative flex gap-5 py-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:drop-shadow-lg" />
                <div className="z-10 mt-1 w-[120px] flex-shrink-0">
                  <div className="overflow-hidden rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30" style={{ aspectRatio: "16/9" }}>
                    {card.image ? (
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="z-10 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-snug">
                      <a href={card.url} target="_blank" rel="noreferrer"
                        className="group/link inline-flex items-baseline gap-1 text-slate-200 hover:text-electricBlue transition-colors text-base font-medium">
                        {card.favicon && (
                          <img src={card.favicon} alt="" className="w-4 h-4 rounded-sm object-contain mr-1 inline-block"
                            onError={(e) => (e.currentTarget.style.display = "none")} />
                        )}
                        {card.title}
                        <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                      </a>
                    </h3>
                    {/* Delete button — admin only */}
                    {isAdmin && (
                      <button
                        onClick={() => onDeletePreview(card.id)}
                        className="z-10 shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1"
                        title="Remove app"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {card.description && <p className="mt-1 text-sm leading-normal line-clamp-3">{card.description}</p>}
                  <p className="mt-1 text-xs text-slate-500 font-mono truncate">
                    {(() => { try { return new URL(card.url).hostname; } catch { return card.url; } })()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
