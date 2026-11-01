import { TIME_ZONE, WEEKDAYS } from "./config.js";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getJakartaDate(date = new Date()) {
  const parts = DATE_FORMATTER.formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function getWeekDates(date = new Date()) {
  const today = getJakartaDate(date);
  const [year, month, day] = today.split("-").map(Number);
  const dateAtUtc = new Date(Date.UTC(year, month - 1, day));
  const mondayOffset = (dateAtUtc.getUTCDay() + 6) % 7;
  dateAtUtc.setUTCDate(dateAtUtc.getUTCDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(dateAtUtc);
    current.setUTCDate(current.getUTCDate() + index);
    const isoDate = current.toISOString().slice(0, 10);
    return { isoDate, dayOfWeek: index + 1 };
  });
}

export function formatJakartaDate(date, options = { day: "numeric", month: "short" }) {
  if (!date) return "";
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T12:00:00+07:00`)
    : new Date(date);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", { ...options, timeZone: TIME_ZONE }).format(dateValue);
}

export function getWeekdayLabel(dayOfWeek) {
  return WEEKDAYS.find((day) => day.value === dayOfWeek)?.label ?? "";
}

export function expandScheduleWeek(schedules, changes = [], date = new Date()) {
  const weekDates = getWeekDates(date);
  const events = [];

  for (const schedule of schedules) {
    for (const occurrence of weekDates.filter((item) => item.dayOfWeek === schedule.dayOfWeek)) {
      if (schedule.startsOn && occurrence.isoDate < schedule.startsOn) continue;
      if (schedule.endsOn && occurrence.isoDate > schedule.endsOn) continue;

      const change = changes.find((item) => (
        item.scheduleId === schedule.id
        && item.originalDate === occurrence.isoDate
        && item.kind !== "extra"
      ));
      if (change?.kind === "cancelled") {
        events.push({
          ...schedule,
          id: `${schedule.id}-${occurrence.isoDate}-cancelled`,
          scheduleId: schedule.id,
          date: occurrence.isoDate,
          kind: "cancelled",
          note: change.note,
        });
      } else if (change?.kind === "rescheduled") {
        continue;
      } else {
        events.push({
          ...schedule,
          id: `${schedule.id}-${occurrence.isoDate}`,
          scheduleId: schedule.id,
          date: occurrence.isoDate,
          kind: "regular",
        });
      }
    }
  }

  for (const change of changes.filter((item) => item.kind === "rescheduled" && item.newDate)) {
    const schedule = schedules.find((item) => item.id === change.scheduleId);
    if (schedule && weekDates.some((item) => item.isoDate === change.newDate)) {
      events.push({
        ...schedule,
        id: change.id,
        scheduleId: schedule.id,
        date: change.newDate,
        startTime: change.startTime || schedule.startTime,
        endTime: change.endTime || schedule.endTime,
        room: change.room || schedule.room,
        kind: "rescheduled",
        originalDate: change.originalDate,
        note: change.note,
      });
    }
  }

  for (const change of changes.filter((item) => item.kind === "extra" && item.newDate)) {
    if (weekDates.some((item) => item.isoDate === change.newDate)) {
      events.push({
        ...change,
        id: change.id,
        scheduleId: null,
        date: change.newDate,
        startTime: change.startTime,
        endTime: change.endTime,
        room: change.room,
        kind: "extra",
      });
    }
  }

  return events.sort((left, right) => left.date.localeCompare(right.date) || left.startTime.localeCompare(right.startTime));
}

export function validateScheduleTimes(startTime, endTime) {
  if (!startTime || !endTime || endTime <= startTime) {
    return "Jam selesai harus setelah jam mulai.";
  }
  return null;
}

export function validateScheduleChange(change, changes, schedules) {
  if (!["cancelled", "rescheduled", "extra"].includes(change.kind)) {
    return "Pilih jenis perubahan jadwal.";
  }
  if (change.kind === "extra") {
    if (!change.newDate) return "Tanggal kuliah tambahan tidak boleh kosong.";
    const timeError = validateScheduleTimes(change.startTime, change.endTime);
    if (timeError) return timeError;
    if (hasScheduleConflict(change.newDate, change.startTime, change.endTime, changes, schedules, change.id)) {
      return "Jam kuliah tambahan bertabrakan dengan jadwal lain pada tanggal tersebut.";
    }
  } else {
    if (!change.scheduleId || !change.originalDate) return "Pilih jadwal dan tanggal kuliah asal.";
    if (changes.some((item) => item.scheduleId === change.scheduleId && item.originalDate === change.originalDate && item.id !== change.id)) {
      return "Perubahan untuk jadwal dan tanggal tersebut sudah ada.";
    }
    if (change.kind === "rescheduled") {
      if (!change.newDate) return "Tanggal baru wajib diisi untuk pemindahan.";
      const schedule = schedules.find((item) => item.id === change.scheduleId);
      const timeError = validateScheduleTimes(
        change.startTime || schedule?.startTime,
        change.endTime || schedule?.endTime,
      );
      if (timeError) return timeError;
      const movingDay = new Date(`${change.newDate}T12:00:00+07:00`).getDay() || 7;
      const start = change.startTime || schedule?.startTime;
      const end = change.endTime || schedule?.endTime;
      if (hasScheduleConflict(change.newDate, start, end, changes, schedules, change.id, change.scheduleId)) {
        return "Jam pemindahan bertabrakan dengan jadwal kuliah lain.";
      }
    }
  }
  return null;
}

function hasScheduleConflict(date, startTime, endTime, changes, schedules, exceptChangeId, exceptScheduleId) {
  const dayOfWeek = new Date(`${date}T12:00:00+07:00`).getDay() || 7;
  const recurringConflict = schedules.some((schedule) => (
    schedule.id !== exceptScheduleId
    && schedule.dayOfWeek === dayOfWeek
    && (!schedule.startsOn || schedule.startsOn <= date)
    && (!schedule.endsOn || schedule.endsOn >= date)
    && schedule.startTime < endTime
    && schedule.endTime > startTime
    && !changes.some((change) => (
      change.scheduleId === schedule.id
      && change.originalDate === date
      && (change.kind === "cancelled" || change.kind === "rescheduled")
    ))
  ));
  if (recurringConflict) return true;

  return changes.some((change) => {
    if (change.id === exceptChangeId || change.kind === "cancelled") return false;
    const changedDate = change.kind === "extra" || change.kind === "rescheduled" ? change.newDate : null;
    if (changedDate !== date) return false;
    return change.startTime < endTime && change.endTime > startTime;
  });
}
