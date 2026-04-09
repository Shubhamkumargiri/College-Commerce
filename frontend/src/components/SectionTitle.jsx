export default function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p> : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
