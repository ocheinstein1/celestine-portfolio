import { ArrowUpRight, Link2, Pencil, Trash2 } from "lucide-react";

interface ProjectCardProps {
  title: string;
  link: string;
  description: string;
  tech?: string[];
  image?: string;
  projectId?: string;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  title, link, description, tech, image, projectId, isAdmin, onEdit, onDelete
}: ProjectCardProps) {
  return (
    <div className="group relative flex gap-5 py-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
      {/* Thumbnail */}
      <div className="z-10 mt-1 w-[120px] flex-shrink-0">
        <div className="overflow-hidden rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30" style={{ aspectRatio: "16/9" }}>
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-slate-600" />
            </div>
          )}
        </div>
      </div>
      {/* Text */}
      <div className="z-10 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-snug">
            <a
              href={link !== "#" ? link : undefined}
              target={link !== "#" ? "_blank" : undefined}
              rel="noreferrer"
              className="group/link inline-flex items-baseline gap-1 text-slate-200 hover:text-electricBlue transition-colors text-base font-medium"
            >
              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
              {title}
              {link !== "#" && <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />}
            </a>
          </h3>
          {/* Admin actions */}
          {isAdmin && projectId && (
            <div className="z-20 flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit?.(projectId)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-electricBlue hover:bg-electricBlue/10 transition-all"
                title="Edit project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete?.(projectId)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        {description && <p className="mt-1 text-sm leading-normal line-clamp-3">{description}</p>}
        {tech && tech.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <li key={t} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-electricBlue">{t}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
