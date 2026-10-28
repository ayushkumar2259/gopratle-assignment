import { CATEGORIES } from "@/lib/constants";

function Row({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900 sm:col-span-2">{value || "—"}</dd>
    </div>
  );
}

export default function StepReview({ formData, onEdit }) {
  const categoryLabel = CATEGORIES.find((item) => item.value === formData.category)?.label || formData.category;
  const sameDay = formData.startDate === formData.endDate;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Review and submit</h2>
        <p className="mt-1 text-sm text-slate-600">
          Check every detail. You can go back and edit a step before submitting. Success is shown only after the
          database save completes.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Event basics</h3>
          <button type="button" className="text-sm font-medium text-teal-800 hover:underline" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>
        <dl>
          <Row label="Event name" value={formData.eventName} />
          <Row label="Event type" value={formData.eventType} />
          <Row
            label="Dates"
            value={sameDay ? `${formData.startDate} (single day)` : `${formData.startDate} to ${formData.endDate}`}
          />
          <Row label="Location" value={formData.location} />
          <Row label="Venue" value={formData.venue} />
          <Row label="Category" value={categoryLabel} />
        </dl>
      </section>

      {formData.category === "planner" ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Planner details</h3>
            <button type="button" className="text-sm font-medium text-teal-800 hover:underline" onClick={() => onEdit(2)}>
              Edit
            </button>
          </div>
          <dl>
            <Row label="Expected attendees" value={formData.plannerDetails.expectedAttendees} />
            <Row label="Budget (INR)" value={formData.plannerDetails.budget} />
            <Row label="Services" value={formData.plannerDetails.requiredServices.join(", ")} />
            <Row label="Experience" value={formData.plannerDetails.experience} />
            <Row label="Number of planners" value={formData.plannerDetails.numberOfPlanners} />
            <Row label="Notes" value={formData.plannerDetails.additionalNotes} />
          </dl>
        </section>
      ) : null}

      {formData.category === "performer" ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Performer details</h3>
            <button type="button" className="text-sm font-medium text-teal-800 hover:underline" onClick={() => onEdit(2)}>
              Edit
            </button>
          </div>
          <dl>
            <Row label="Performer type" value={formData.performerDetails.performerType} />
            <Row label="Genre" value={formData.performerDetails.genre} />
            <Row label="Performer count" value={formData.performerDetails.performerCount} />
            <Row label="Duration" value={formData.performerDetails.performanceDuration} />
            <Row label="Budget (INR)" value={formData.performerDetails.budget} />
            <Row label="Equipment" value={formData.performerDetails.equipment} />
            <Row label="Language" value={formData.performerDetails.preferredLanguage} />
            <Row label="Notes" value={formData.performerDetails.additionalNotes} />
          </dl>
        </section>
      ) : null}

      {formData.category === "crew" ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Crew details</h3>
            <button type="button" className="text-sm font-medium text-teal-800 hover:underline" onClick={() => onEdit(2)}>
              Edit
            </button>
          </div>
          <dl>
            <Row label="Roles" value={formData.crewDetails.requiredRoles.join(", ")} />
            <Row label="Crew members" value={formData.crewDetails.crewCount} />
            <Row label="Shift / hours" value={formData.crewDetails.shiftHours} />
            <Row label="Experience" value={formData.crewDetails.experience} />
            <Row label="Skills / equipment" value={formData.crewDetails.skillsEquipment} />
            <Row label="Payment range" value={formData.crewDetails.paymentRange} />
            <Row label="Notes" value={formData.crewDetails.additionalNotes} />
          </dl>
        </section>
      ) : null}
    </div>
  );
}
