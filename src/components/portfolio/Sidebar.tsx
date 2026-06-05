import { useEffect } from "react";
import { portfolioData } from "@/lib/data";
import { Github, Linkedin, Mail, Twitter, Unlock, X } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Sidebar({ activeSection, isAdmin, onLoginClick, onLogoutClick }: SidebarProps) {
  // Secret keyboard shortcut: Ctrl+Shift+A — not visible to visitors
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        isAdmin ? onLogoutClick() : onLoginClick();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin, onLoginClick, onLogoutClick]);

  const navItems = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <>
      <header className="py-12 lg:py-24 lg:w-[45%] lg:sticky lg:top-0 lg:max-h-screen lg:flex lg:flex-col lg:justify-between">
        <div>
          {/* Profile Picture */}
          <div className="mb-8 group relative w-fit">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-electricBlue via-teal-400 to-slate-600 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-28 h-28 rounded-full border-2 border-navy overflow-hidden">
              <img
                src="/profile.jpg"
                alt="Celestine Oche"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-electricBlue tracking-tight">
                CO
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">Celestine Oche</h1>
          <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200">Tech Innovator &amp; AI Builder</h2>
          <p className="mt-4 max-w-xs leading-normal">Building intelligent systems, educational platforms, and digital experiences for the future.</p>

          <nav className="hidden lg:block mt-16">
            <ul>
              {navItems.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="group flex items-center py-3">
                    <span className={`mr-4 h-px transition-all duration-300 ${activeSection === id ? "w-16 bg-slate-200" : "w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200"}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${activeSection === id ? "text-slate-200" : "text-slate-500 group-hover:text-slate-200"}`}>
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-5 mt-8 lg:mt-0 text-slate-400">
          {[
            { href: portfolioData.socials.github, Icon: Github, label: "GitHub" },
            { href: portfolioData.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
            { href: portfolioData.socials.twitter, Icon: Twitter, label: "Twitter" },
            { href: portfolioData.socials.email, Icon: Mail, label: "Email" },
          ].map(({ href, Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="hover:text-slate-200 transition-colors">
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </header>

      {/*
        Admin indicator — only shown when YOU are logged in.
        Visitors see nothing. Access via Ctrl+Shift+A (secret shortcut).
      */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 z-50">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-electricBlue text-navy text-sm font-semibold shadow-lg shadow-electricBlue/20">
            <Unlock className="w-4 h-4" />
            <span>Admin Mode</span>
            <button
              onClick={onLogoutClick}
              className="ml-1 hover:opacity-70 transition-opacity"
              title="Exit admin mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
