"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { emptyCrewDetails, emptyPerformerDetails, emptyPlannerDetails, initialFormData } from "@/lib/constants";
import { buildPayload, validateStep1, validateStep2, validateStep3 } from "@/lib/validation";
import { createRequirement } from "@/lib/api";
import ProgressIndicator from "./ProgressIndicator";
import StepEventBasics from "./StepEventBasics";
import StepRequirements from "./StepRequirements";
import StepPreferences from "./StepPreferences";
import StepReview from "./StepReview";

export default function RequirementWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(
    () => ({
      1: validateStep1,
      2: validateStep2,
      3: validateStep3,
    }),
    []
  );

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function updateNested(section, event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [section]: { ...current[section], [name]: value },
    }));
  }

  function toggleListValue(section, field, value) {
    setFormData((current) => {
      const list = current[section][field];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [section]: { ...current[section], [field]: next } };
    });
  }

  function changeCategory(category) {
    setFormData((current) => ({
      ...current,
      category,
      plannerDetails: { ...emptyPlannerDetails },
      performerDetails: { ...emptyPerformerDetails },
      crewDetails: { ...emptyCrewDetails },
    }));
    setErrors({});
  }

  function goTo(nextStep) {
    setErrors({});
    setSubmitError("");
    setStep(nextStep);
  }

  function handleBack() {
    if (step > 1) {
      goTo(step - 1);
    }
  }

  function handleContinue() {
    const validate = validators[step];
    const nextErrors = validate ? validate(formData) : {};
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    goTo(step + 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nextErrors = { ...validateStep1(formData), ...validateStep2(formData), ...validateStep3(formData) };
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await createRequirement(buildPayload(formData));
      const id = result.data?._id;
      if (!id) {
        throw new Error("The server did not return a saved record id.");
      }
      router.push(`/success/${id}`);
    } catch (error) {
      const serverErrors = error.errors || [];
      const mapped = {};
      serverErrors.forEach((item) => {
        const field = String(item.field || "").split(".").pop();
        if (field) {
          mapped[field] = item.message;
        }
      });
      setErrors(mapped);
      setSubmitError(error.message || "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <ProgressIndicator currentStep={step} />

      {step === 1 ? (
        <StepEventBasics
          formData={formData}
          errors={errors}
          onChange={updateField}
          onCategoryChange={changeCategory}
        />
      ) : null}
      {step === 2 ? (
        <StepRequirements
          formData={formData}
          errors={errors}
          onNestedChange={updateNested}
          onToggle={toggleListValue}
        />
      ) : null}
      {step === 3 ? (
        <StepPreferences formData={formData} errors={errors} onNestedChange={updateNested} />
      ) : null}
      {step === 4 ? <StepReview formData={formData} onEdit={goTo} /> : null}

      {submitError ? (
        <p className="mt-6 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1 || submitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={handleContinue}
            className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting…" : "Submit requirement"}
          </button>
        )}
      </div>
    </form>
  );
}
