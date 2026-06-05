import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/components/ui/AdminEditModal";

interface ProjectsSectionProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: () => void;
  onEditProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectsSection({
  projects, isAdmin, onAddProject, onEditProject, onDeleteProject
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="mb-16 scroll-mt-16 lg:mb-36 lg:scroll-mt-24">
      <SectionLabel label="Projects" />

      {/* Add project button — admin only, strictly gated */}
      {isAdmin === true && (
        <button
          onClick={onAddProject}
          className="mb-8 flex items-center gap-2 rounded-lg border border-dashed border-electricBlue/40 px-4 py-2.5 text-sm text-electricBlue hover:bg-electricBlue/5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      )}

      <ol className="group/list flex flex-col gap-12">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectCard
                title={project.title}
                link={project.link}
                description={project.description}
                tech={project.tech}
                image={project.image}
                projectId={project.id}
                isAdmin={isAdmin}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
}
