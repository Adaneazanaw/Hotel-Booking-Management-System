/**
 * Safely parse a fetch Response as JSON.
 * If the body is empty or not valid JSON, returns a fallback object
 * so callers never crash with "Unexpected end of JSON input".
 */
export async function fetchJson(res) {
  const text = await res.text();
  if (!text || text.trim() === "") {
    return { success: false, message: "Server returned an empty response." };
  }
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: "Server returned an invalid response." };
  }
}
