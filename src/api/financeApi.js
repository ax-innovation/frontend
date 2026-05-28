const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function getRecommendations(params) {
  const res = await fetch(`${BASE_URL}/api/v1/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
