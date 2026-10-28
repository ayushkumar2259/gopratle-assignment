"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequirement } from "@/lib/api";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 sm:text-right">{value ?? "—"}</dd>
    </div>
  );
}

function PlannerDetails({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        Planner details
      </h3>
      <dl className="space-y-2">
        <DetailRow label="Expected attendees" value={details.expectedAttendees} />
        <DetailRow label="Budget" value={details.budget} />
        <DetailRow
          label="Required services"
          value={(details.requiredServices || []).join(", ") || "—"}
        />
        <DetailRow label="Experience" value={details.experience} />
        <DetailRow label="Number of planners" value={details.numberOfPlanners} />
        {details.additionalNotes ? (
          <DetailRow label="Additional notes" value={details.additionalNotes} />
        ) : null}
      </dl>
    </div>
  );
}

function PerformerDetails({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        Performer details
      </h3>
      <dl className="space-y-2">
        <DetailRow label="Performer type" value={details.performerType} />
        <DetailRow label="Genre" value={details.genre} />
        <DetailRow label="Performer count" value={details.performerCount} />
        <DetailRow label="Performance duration" value={details.performanceDuration} />
        <DetailRow label="Equipment" value={details.equipment} />
        <DetailRow label="Preferred language" value={details.preferredLanguage} />
      </dl>
    </div>
  );
}

function CrewDetails({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        Crew details
      </h3>
      <dl className="space-y-2">
        <DetailRow label="Required roles" value={(details.requiredRoles || []).join(", ") || "—"} />
        <DetailRow label="Crew count" value={details.crewCount} />
        <DetailRow label="Shift hours" value={details.shiftHours} />
        <DetailRow label="Payment range" value={details.paymentRange} />
      </dl>
    </div>
  );
}

export default function SuccessDetails({ id }) {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getRequirement(id);
        if (!cancelled) {
          setRecord(result.data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Submitted</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Requirement saved</h1>
        <p className="mt-2 text-slate-600">
        
        </p>

        {loading ? <p className="mt-6 text-slate-600">Loading saved record…</p> : null}
        {error ? (
          <p className="mt-6 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
            {error}
          </p>
        ) : null}

        {record ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
              <dl className="mt-4 space-y-2">
                <DetailRow label="Event name" value={record.eventName} />
                <DetailRow label="Event type" value={record.eventType} />
                <DetailRow label="Start date" value={formatDate(record.startDate)} />
                <DetailRow label="End date" value={formatDate(record.endDate)} />
                <DetailRow label="Location" value={record.location} />
                <DetailRow label="Venue" value={record.venue} />
                <DetailRow label="Category" value={record.category} />
                <DetailRow label="Status" value={record.status} />
              </dl>
            </div>

            {record.category === "planner" ? (
              <PlannerDetails details={record.plannerDetails} />
            ) : null}
            {record.category === "performer" ? (
              <PerformerDetails details={record.performerDetails} />
            ) : null}
            {record.category === "crew" ? (
              <CrewDetails details={record.crewDetails} />
            ) : null}

           
          </div>
        ) : null}

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
        >
          Post another requirement
        </Link>
      </div>
    </div>
  );
}
