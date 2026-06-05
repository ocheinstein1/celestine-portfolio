import { portfolioData } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function AboutSection() {
  return (
    <section id="about" className="mb-16 scroll-mt-16 lg:mb-36 lg:scroll-mt-24">
      <SectionLabel label="About" />
      <p className="leading-relaxed">{portfolioData.about}</p>
    </section>
  );
}
