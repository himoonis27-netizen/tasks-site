export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.requestPermission();
}

export function startDueTaskWatcher(getTasks) {
  if (!("Notification" in window)) return () => {};

  const check = () => {
    if (Notification.permission !== "granted") return;

    const today = new Date().toISOString().slice(0, 10);
    const tasks = getTasks();

    for (const task of tasks) {
      if (!task.done && task.due_date === today) {
        const storageKey = `notif_${task.id}_${today}`;
        const last = localStorage.getItem(storageKey);

        if (!last) {
          new Notification("Невыполненная задача", {
            body: `Задача \"${task.text}\" всё ещё не закрыта`,
            tag: `task-${task.id}-${today}`,
          });
          localStorage.setItem(storageKey, String(Date.now()));
        }
      }
    }
  };

  check();
  const id = window.setInterval(check, 60_000);
  return () => window.clearInterval(id);
}
