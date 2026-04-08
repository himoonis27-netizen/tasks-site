const NOTES_URL = "/.netlify/functions/notes";
const TASKS_URL = "/.netlify/functions/tasks";

export function getSavedKey() {
  return localStorage.getItem("app_access_key") || "";
}

export function saveKey(key) {
  localStorage.setItem("app_access_key", key);
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-app-key": getSavedKey(),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const notesApi = {
  list: () => api(NOTES_URL),
  create: (payload) =>
    api(NOTES_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    api(`${NOTES_URL}?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    api(`${NOTES_URL}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export const tasksApi = {
  list: () => api(TASKS_URL),
  create: (payload) =>
    api(TASKS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    api(`${TASKS_URL}?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    api(`${TASKS_URL}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
