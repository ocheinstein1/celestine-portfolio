export default function SectionLabel({ label }: { label: string }) {
  return (
    <div className="sticky top-0 z-20 -mx-6 mb-6 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{label}</h2>
    </div>
  );
}
