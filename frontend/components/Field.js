export function Field({ id, label, hint, error, children, required = false }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required ? (
          <span className="text-rose-600" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-slate-500">(optional)</span>
        )}
      </label>
      {children(describedBy)}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ id, error, className = "", ...props }) {
  return (
    <input
      id={id}
      aria-invalid={error ? "true" : "false"}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-600/30 ${
        error ? "border-rose-500" : "border-slate-300 focus:border-teal-700"
      } ${className}`}
      {...props}
    />
  );
}

export function SelectInput({ id, error, children, ...props }) {
  return (
    <select
      id={id}
      aria-invalid={error ? "true" : "false"}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-600/30 ${
        error ? "border-rose-500" : "border-slate-300 focus:border-teal-700"
      }`}
      {...props}
    >
      {children}
    </select>
  );
}

export function TextArea({ id, error, ...props }) {
  return (
    <textarea
      id={id}
      aria-invalid={error ? "true" : "false"}
      className={`min-h-24 w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-600/30 ${
        error ? "border-rose-500" : "border-slate-300 focus:border-teal-700"
      }`}
      {...props}
    />
  );
}
