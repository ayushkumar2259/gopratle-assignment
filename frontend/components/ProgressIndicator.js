import { STEPS } from "@/lib/constants";

export default function ProgressIndicator({ currentStep }) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((step) => {
          const complete = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <li key={step.id} className="min-w-0">
              <div
                className={`rounded-xl border px-3 py-3 ${
                  active
                    ? "border-teal-700 bg-teal-50"
                    : complete
                      ? "border-teal-200 bg-white"
                      : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step {step.id}
                </p>
                <p className={`truncate text-sm font-semibold ${active ? "text-teal-900" : "text-slate-800"}`}>
                  {step.title}
                </p>
                <span className="sr-only">{active ? "Current step" : complete ? "Completed" : "Upcoming"}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div
          className="h-full rounded-full bg-teal-700 transition-all"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
    </nav>
  );
}
