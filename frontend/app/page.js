import RequirementWizard from "@/components/RequirementWizard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Event Planning Made Simple</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Post an event requirement
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Complete four steps to describe your event and the planner, performer, or crew you need. Your data stays in
          the form until you submit. Success appears only after it is saved.
        </p>
      </div>
      <RequirementWizard />
    </div>
  );
}
