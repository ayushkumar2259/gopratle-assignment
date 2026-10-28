import { CREW_ROLES, GENRES, PERFORMER_TYPES, PLANNER_SERVICES, SHIFT_OPTIONS } from "@/lib/constants";
import { Field, SelectInput, TextInput } from "./Field";

function CheckboxGroup({ name, options, values, onToggle, error }) {
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={values.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
            />
            <span className="text-sm text-slate-800">{option}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function StepRequirements({ formData, errors, onNestedChange, onToggle }) {
  if (formData.category === "planner") {
    return (
      <div className="space-y-6">
        <Header title="Planner requirements" text="Share scale, budget, and the services you need." />
        <Field id="expectedAttendees" label="Expected attendees" required error={errors.expectedAttendees}>
          {(describedBy) => (
            <TextInput
              id="expectedAttendees"
              name="expectedAttendees"
              inputMode="numeric"
              value={formData.plannerDetails.expectedAttendees}
              onChange={(event) => onNestedChange("plannerDetails", event)}
              aria-describedby={describedBy}
              error={errors.expectedAttendees}
            />
          )}
        </Field>
        <Field id="budget" label="Budget (INR)" required error={errors.budget}>
          {(describedBy) => (
            <TextInput
              id="budget"
              name="budget"
              inputMode="numeric"
              value={formData.plannerDetails.budget}
              onChange={(event) => onNestedChange("plannerDetails", event)}
              aria-describedby={describedBy}
              error={errors.budget}
            />
          )}
        </Field>
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            Required services <span className="text-rose-600">*</span>
          </legend>
          <div className="mt-3">
            <CheckboxGroup
              name="requiredServices"
              options={PLANNER_SERVICES}
              values={formData.plannerDetails.requiredServices}
              onToggle={(value) => onToggle("plannerDetails", "requiredServices", value)}
              error={errors.requiredServices}
            />
          </div>
        </fieldset>
      </div>
    );
  }

  if (formData.category === "performer") {
    return (
      <div className="space-y-6">
        <Header title="Performer requirements" text="Describe the talent you want to book." />
        <Field id="performerType" label="Performer type" required error={errors.performerType}>
          {(describedBy) => (
            <SelectInput
              id="performerType"
              name="performerType"
              value={formData.performerDetails.performerType}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.performerType}
            >
              <option value="">Select type</option>
              {PERFORMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field id="genre" label="Genre" required error={errors.genre}>
          {(describedBy) => (
            <SelectInput
              id="genre"
              name="genre"
              value={formData.performerDetails.genre}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.genre}
            >
              <option value="">Select genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field id="performerCount" label="Number of performers" required error={errors.performerCount}>
          {(describedBy) => (
            <TextInput
              id="performerCount"
              name="performerCount"
              inputMode="numeric"
              value={formData.performerDetails.performerCount}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.performerCount}
            />
          )}
        </Field>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header title="Crew requirements" text="Tell us which crew roles you need and for how long." />
      <fieldset>
        <legend className="text-sm font-medium text-slate-800">
          Required roles <span className="text-rose-600">*</span>
        </legend>
        <div className="mt-3">
          <CheckboxGroup
            name="requiredRoles"
            options={CREW_ROLES}
            values={formData.crewDetails.requiredRoles}
            onToggle={(value) => onToggle("crewDetails", "requiredRoles", value)}
            error={errors.requiredRoles}
          />
        </div>
      </fieldset>
      <Field id="crewCount" label="Number of crew members" required error={errors.crewCount}>
        {(describedBy) => (
          <TextInput
            id="crewCount"
            name="crewCount"
            inputMode="numeric"
            value={formData.crewDetails.crewCount}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.crewCount}
          />
        )}
      </Field>
      <Field id="shiftHours" label="Shift / hours" required error={errors.shiftHours}>
        {(describedBy) => (
          <SelectInput
            id="shiftHours"
            name="shiftHours"
            value={formData.crewDetails.shiftHours}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.shiftHours}
          >
            <option value="">Select shift</option>
            {SHIFT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
    </div>
  );
}

function Header({ title, text }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
