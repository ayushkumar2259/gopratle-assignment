import { CATEGORIES, EVENT_TYPES } from "@/lib/constants";
import { Field, SelectInput, TextInput } from "./Field";

export default function StepEventBasics({ formData, errors, onChange, onCategoryChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Event basics</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tell us what the event is, when it happens, and who you need. Same-day start and end dates are allowed.
        </p>
      </div>

      <Field id="eventName" label="Event name" required error={errors.eventName}>
        {(describedBy) => (
          <TextInput
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={onChange}
            aria-describedby={describedBy}
            error={errors.eventName}
            autoComplete="off"
          />
        )}
      </Field>

      <Field id="eventType" label="Event type" required error={errors.eventType}>
        {(describedBy) => (
          <SelectInput
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={onChange}
            aria-describedby={describedBy}
            error={errors.eventType}
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="startDate" label="Start date" required error={errors.startDate}>
          {(describedBy) => (
            <TextInput
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={onChange}
              aria-describedby={describedBy}
              error={errors.startDate}
            />
          )}
        </Field>
        <Field
          id="endDate"
          label="End date"
          required
          hint="Use the same date as the start date for a one-day event."
          error={errors.endDate}
        >
          {(describedBy) => (
            <TextInput
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={onChange}
              aria-describedby={describedBy}
              error={errors.endDate}
            />
          )}
        </Field>
      </div>

      <Field id="location" label="Location" required error={errors.location}>
        {(describedBy) => (
          <TextInput
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
            aria-describedby={describedBy}
            error={errors.location}
            placeholder="City or area"
          />
        )}
      </Field>

      <Field id="venue" label="Venue" error={errors.venue}>
        {(describedBy) => (
          <TextInput
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={onChange}
            aria-describedby={describedBy}
            error={errors.venue}
            placeholder="Venue name, if known"
          />
        )}
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-slate-800">
          Required category <span className="text-rose-600">*</span>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((category) => {
            const selected = formData.category === category.value;
            return (
              <label
                key={category.value}
                className={`cursor-pointer rounded-xl border p-4 ${
                  selected ? "border-teal-700 bg-teal-50" : "border-slate-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={selected}
                  onChange={(event) => onCategoryChange(event.target.value)}
                  className="sr-only"
                />
                <span className="block font-semibold text-slate-900">{category.label}</span>
                <span className="mt-1 block text-sm text-slate-600">{category.description}</span>
              </label>
            );
          })}
        </div>
        {errors.category ? (
          <p className="mt-2 text-sm text-rose-700" role="alert">
            {errors.category}
          </p>
        ) : null}
      </fieldset>
    </div>
  );
}
