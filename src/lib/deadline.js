import { getJakartaDate } from "./schedule-utils.js";

export function getDeadlineStatus(deadline, now = new Date()) {
  if (!deadline) return { label: "Tanpa deadline", tone: "" };

  const deadlineValue = new Date(deadline);
  if (Number.isNaN(deadlineValue.getTime())) return { label: "Deadline tidak valid", tone: "" };
  const deadlineDate = getJakartaDate(deadlineValue);
  const todayDate = getJakartaDate(now);
  const [deadlineYear, deadlineMonth, deadlineDay] = deadlineDate.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = todayDate.split("-").map(Number);
  const daysRemaining = Math.round(
    (Date.UTC(deadlineYear, deadlineMonth - 1, deadlineDay) - Date.UTC(todayYear, todayMonth - 1, todayDay))
    / (24 * 60 * 60 * 1000),
  );

  if (daysRemaining < 0) return { label: "Lewat", tone: "overdue" };
  if (daysRemaining === 0) return { label: "Hari ini", tone: "due" };
  return { label: `${daysRemaining} hari lagi`, tone: "" };
}
