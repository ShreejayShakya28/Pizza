// Labelled input/select. `as="select"` renders a <select> with <option> children.
export default function Field({ label, as: Tag = 'input', hint, children, ...props }) {
  return (
    <label className="block">
      <span className="font-semibold">{label}</span>
      <Tag
        {...props}
        className="mt-1 w-full rounded-lg border-2 border-ink/20 bg-white/60 px-3 py-2
                   focus:border-enamel focus:outline-none disabled:opacity-60"
      >
        {children}
      </Tag>
      {hint && <span className="mt-1 block text-sm text-ink/60">{hint}</span>}
    </label>
  );
}
