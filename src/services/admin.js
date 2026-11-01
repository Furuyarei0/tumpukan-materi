import { updateDevelopmentFixtures, getDevelopmentFixtures } from "./dataAdapter.js";
import { validateMaterialFile } from "../lib/file-validation.js";
import { validateScheduleChange, validateScheduleTimes } from "../lib/schedule-utils.js";
import * as supabaseAdmin from "./adminSupabase.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function assertAdmin(isAdmin) {
  if (!isAdmin) throw new Error("Aksi ini memerlukan sesi admin.");
}

export async function getAdminData(isAdmin) {
  assertAdmin(isAdmin);
  const data = await getDevelopmentFixtures();
  if (!data) return supabaseAdmin.getAdminData(isAdmin);
  return data;
}

export async function saveCourse(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.saveCourse(input, isAdmin);
  if (!input.name?.trim()) throw new Error("Nama mata kuliah wajib diisi.");
  if (input.credits && (Number(input.credits) < 1 || Number(input.credits) > 6)) throw new Error("SKS harus antara 1 dan 6.");
  return updateDevelopmentFixtures((data) => {
    const record = {
      ...input,
      id: input.id || createId("course"),
      name: input.name.trim(),
      lecturer: input.lecturer?.trim() ?? "",
      credits: input.credits ? Number(input.credits) : null,
      sortOrder: Number(input.sortOrder) || 0,
    };
    const courses = input.id
      ? data.courses.map((course) => course.id === input.id ? record : course)
      : [...data.courses, record];
    return { ...data, courses };
  });
}

export async function deleteCourse(courseId, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.deleteCourse(courseId, isAdmin);
  return updateDevelopmentFixtures((data) => {
    data.materials.filter((material) => material.courseId === courseId && material.url?.startsWith("blob:"))
      .forEach((material) => URL.revokeObjectURL(material.url));
    return {
      ...data,
      courses: data.courses.filter((course) => course.id !== courseId),
      schedules: data.schedules.filter((schedule) => schedule.courseId !== courseId),
      tasks: data.tasks.map((task) => task.courseId === courseId ? { ...task, courseId: null, courseName: "" } : task),
      materials: data.materials.filter((material) => material.courseId !== courseId),
      scheduleChanges: data.scheduleChanges.filter((change) => change.courseId !== courseId),
    };
  });
}

export async function saveTask(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.saveTask(input, isAdmin);
  if (!input.title?.trim()) throw new Error("Judul tugas wajib diisi.");
  const deadline = input.deadlineLocal ? new Date(`${input.deadlineLocal}:00+07:00`) : null;
  if (deadline && Number.isNaN(deadline.getTime())) throw new Error("Tanggal deadline tidak valid.");
  return updateDevelopmentFixtures((data) => {
    const now = new Date().toISOString();
    const record = {
      ...input,
      id: input.id || createId("task"),
      title: input.title.trim(),
      courseName: data.courses.find((course) => course.id === input.courseId)?.name ?? "",
      deadline: deadline?.toISOString() ?? null,
      createdAt: input.createdAt ?? now,
      updatedAt: input.id ? now : null,
    };
    return {
      ...data,
      tasks: input.id ? data.tasks.map((task) => task.id === input.id ? record : task) : [...data.tasks, record],
    };
  });
}

export async function deleteTask(taskId, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.deleteTask(taskId, isAdmin);
  return updateDevelopmentFixtures((data) => ({ ...data, tasks: data.tasks.filter((task) => task.id !== taskId) }));
}

export async function deleteOverdueTasks(isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.deleteOverdueTasks(isAdmin);
  const now = Date.now();
  return updateDevelopmentFixtures((data) => ({
    ...data,
    tasks: data.tasks.filter((task) => !task.deadline || new Date(task.deadline).getTime() >= now),
  }));
}

export async function saveSchedule(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.saveSchedule(input, isAdmin);
  const timeError = validateScheduleTimes(input.startTime, input.endTime);
  if (timeError) throw new Error(timeError);
  if (!input.courseId || !input.dayOfWeek) throw new Error("Mata kuliah dan hari wajib dipilih.");
  if (input.startsOn && input.endsOn && input.endsOn < input.startsOn) throw new Error("Tanggal akhir harus sama atau setelah tanggal mulai.");
  return updateDevelopmentFixtures((data) => {
    const record = {
      ...input,
      id: input.id || createId("schedule"),
      dayOfWeek: Number(input.dayOfWeek),
      room: input.room?.trim() ?? "",
    };
    return {
      ...data,
      schedules: input.id ? data.schedules.map((schedule) => schedule.id === input.id ? record : schedule) : [...data.schedules, record],
    };
  });
}

export async function deleteSchedule(scheduleId, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.deleteSchedule(scheduleId, isAdmin);
  return updateDevelopmentFixtures((data) => ({
    ...data,
    schedules: data.schedules.filter((schedule) => schedule.id !== scheduleId),
    scheduleChanges: data.scheduleChanges.filter((change) => change.scheduleId !== scheduleId),
  }));
}

export async function saveScheduleChange(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.saveScheduleChange(input, isAdmin);
  const data = await getAdminData(isAdmin);
  const schedule = data.schedules.find((item) => item.id === input.scheduleId);
  const error = validateScheduleChange(input, data.scheduleChanges, data.schedules);
  if (error) throw new Error(error);
  const record = {
    ...input,
    id: input.id || createId("change"),
    courseId: input.kind === "extra" ? input.courseId : schedule.courseId,
    startTime: input.startTime || schedule?.startTime || "",
    endTime: input.endTime || schedule?.endTime || "",
    room: input.room || schedule?.room || "",
    note: input.note?.trim() ?? "",
  };
  return updateDevelopmentFixtures((current) => ({
    ...current,
    scheduleChanges: input.id
      ? current.scheduleChanges.map((change) => change.id === input.id ? record : change)
      : [...current.scheduleChanges, record],
  }));
}

export async function deleteScheduleChange(changeId, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.deleteScheduleChange(changeId, isAdmin);
  return updateDevelopmentFixtures((data) => ({
    ...data,
    scheduleChanges: data.scheduleChanges.filter((change) => change.id !== changeId),
  }));
}

export async function saveMaterial(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.saveMaterial(input, isAdmin);
  if (!input.courseId || !input.title?.trim()) throw new Error("Mata kuliah dan judul materi wajib diisi.");
  const fileError = validateMaterialFile(input.file);
  if (fileError) throw new Error(fileError);
  const url = URL.createObjectURL(input.file);
  const record = {
    id: input.id || createId("material"),
    courseId: input.courseId,
    title: input.title.trim(),
    fileName: input.file.name,
    fileSize: input.file.size,
    mimeType: input.file.type,
    status: input.status ?? "approved",
    url,
    createdAt: input.createdAt ?? new Date().toISOString(),
    approvedAt: input.status === "pending" ? null : new Date().toISOString(),
  };
  return updateDevelopmentFixtures((data) => ({
    ...data,
    materials: input.id
      ? data.materials.map((material) => material.id === input.id ? { ...material, ...record } : material)
      : [...data.materials, record],
  }));
}

export async function updateMaterialDetails(materialId, updates, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.updateMaterialDetails(materialId, updates, isAdmin);
  if (!updates.title?.trim() || !updates.courseId) throw new Error("Judul dan mata kuliah wajib diisi.");
  return updateDevelopmentFixtures((data) => ({
    ...data,
    materials: data.materials.map((material) => material.id === materialId
      ? { ...material, title: updates.title.trim(), courseId: updates.courseId }
      : material),
  }));
}

export async function approveMaterial(materialId, updates, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.approveMaterial(materialId, updates, isAdmin);
  if (!updates.title?.trim() || !updates.courseId) throw new Error("Judul dan mata kuliah wajib diisi sebelum menyetujui.");
  return updateDevelopmentFixtures((data) => ({
    ...data,
    materials: data.materials.map((material) => material.id === materialId
      ? { ...material, title: updates.title.trim(), courseId: updates.courseId, status: "approved", approvedAt: new Date().toISOString() }
      : material),
  }));
}

export async function removeMaterial(materialId, isAdmin) {
  assertAdmin(isAdmin);
  if (!await getDevelopmentFixtures()) return supabaseAdmin.removeMaterial(materialId, isAdmin);
  return updateDevelopmentFixtures((data) => {
    const item = data.materials.find((material) => material.id === materialId);
    if (item?.url?.startsWith("blob:")) URL.revokeObjectURL(item.url);
    return { ...data, materials: data.materials.filter((material) => material.id !== materialId) };
  });
}
