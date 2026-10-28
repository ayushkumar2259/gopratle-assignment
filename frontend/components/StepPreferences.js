import { EQUIPMENT_OPTIONS, EXPERIENCE_LEVELS, LANGUAGES, PAYMENT_RANGES } from "@/lib/constants";
import { Field, SelectInput, TextArea, TextInput } from "./Field";

export default function StepPreferences({ formData, errors, onNestedChange }) {
  if (formData.category === "planner") {
    return (
      <div className="space-y-6">
        <Header title="Planner preferences" text="Experience, team size, and anything else vendors should know." />
        <Field id="experience" label="Experience needed" required error={errors.experience}>
          {(describedBy) => (
            <SelectInput
              id="experience"
              name="experience"
              value={formData.plannerDetails.experience}
              onChange={(event) => onNestedChange("plannerDetails", event)}
              aria-describedby={describedBy}
              error={errors.experience}
            >
              <option value="">Select experience</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field id="numberOfPlanners" label="Number of planners" required error={errors.numberOfPlanners}>
          {(describedBy) => (
            <TextInput
              id="numberOfPlanners"
              name="numberOfPlanners"
              inputMode="numeric"
              value={formData.plannerDetails.numberOfPlanners}
              onChange={(event) => onNestedChange("plannerDetails", event)}
              aria-describedby={describedBy}
              error={errors.numberOfPlanners}
            />
          )}
        </Field>
        <Field id="additionalNotes" label="Additional notes" error={errors.additionalNotes}>
          {(describedBy) => (
            <TextArea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.plannerDetails.additionalNotes}
              onChange={(event) => onNestedChange("plannerDetails", event)}
              aria-describedby={describedBy}
              error={errors.additionalNotes}
            />
          )}
        </Field>
      </div>
    );
  }

  if (formData.category === "performer") {
    return (
      <div className="space-y-6">
        <Header title="Performer preferences" text="Duration, budget, equipment, and language." />
        <Field id="performanceDuration" label="Performance duration" required error={errors.performanceDuration}>
          {(describedBy) => (
            <TextInput
              id="performanceDuration"
              name="performanceDuration"
              value={formData.performerDetails.performanceDuration}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.performanceDuration}
              placeholder="e.g. 90 minutes"
            />
          )}
        </Field>
        <Field id="budget" label="Budget (INR)" required error={errors.budget}>
          {(describedBy) => (
            <TextInput
              id="budget"
              name="budget"
              inputMode="numeric"
              value={formData.performerDetails.budget}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.budget}
            />
          )}
        </Field>
        <Field id="equipment" label="Equipment" required error={errors.equipment}>
          {(describedBy) => (
            <SelectInput
              id="equipment"
              name="equipment"
              value={formData.performerDetails.equipment}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.equipment}
            >
              <option value="">Select equipment needs</option>
              {EQUIPMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field id="preferredLanguage" label="Preferred language" required error={errors.preferredLanguage}>
          {(describedBy) => (
            <SelectInput
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.performerDetails.preferredLanguage}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.preferredLanguage}
            >
              <option value="">Select language</option>
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field id="additionalNotes" label="Additional notes" error={errors.additionalNotes}>
          {(describedBy) => (
            <TextArea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.performerDetails.additionalNotes}
              onChange={(event) => onNestedChange("performerDetails", event)}
              aria-describedby={describedBy}
              error={errors.additionalNotes}
            />
          )}
        </Field>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header title="Crew preferences" text="Experience, skills, equipment, and payment range." />
      <Field id="experience" label="Experience needed" required error={errors.experience}>
        {(describedBy) => (
          <SelectInput
            id="experience"
            name="experience"
            value={formData.crewDetails.experience}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.experience}
          >
            <option value="">Select experience</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
      <Field id="skillsEquipment" label="Skills / equipment" required error={errors.skillsEquipment}>
        {(describedBy) => (
          <TextArea
            id="skillsEquipment"
            name="skillsEquipment"
            value={formData.crewDetails.skillsEquipment}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.skillsEquipment}
            placeholder="Cameras, mixers, certifications, etc."
          />
        )}
      </Field>
      <Field id="paymentRange" label="Budget / payment range" required error={errors.paymentRange}>
        {(describedBy) => (
          <SelectInput
            id="paymentRange"
            name="paymentRange"
            value={formData.crewDetails.paymentRange}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.paymentRange}
          >
            <option value="">Select range</option>
            {PAYMENT_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
      <Field id="additionalNotes" label="Additional notes" error={errors.additionalNotes}>
        {(describedBy) => (
          <TextArea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.crewDetails.additionalNotes}
            onChange={(event) => onNestedChange("crewDetails", event)}
            aria-describedby={describedBy}
            error={errors.additionalNotes}
          />
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
