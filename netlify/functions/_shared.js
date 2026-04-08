import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function isAuthorized(event) {
  const headerKey = event.headers["x-app-key"] || event.headers["X-App-Key"];
  return headerKey && headerKey === process.env.APP_ACCESS_KEY;
}

export function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

export function unauthorized() {
  return json(401, { error: "Unauthorized" });
}

export function badRequest(message) {
  return json(400, { error: message });
}
