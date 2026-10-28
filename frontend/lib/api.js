const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function createRequirement(payload) {
  const response = await fetch(`${API_URL}/api/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "Unable to submit the requirement.");
    error.status = response.status;
    error.errors = body.errors || [];
    throw error;
  }

  return body;
}

export async function getRequirement(id) {
  const response = await fetch(`${API_URL}/api/requirements/${id}`, {
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Unable to load the requirement.");
  }

  return body;
}
