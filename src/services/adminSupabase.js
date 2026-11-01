import { getSupabaseClient } from "../lib/supabase.js";
import { validateMaterialFile } from "../lib/file-validation.js";
import { validateScheduleChange, validateScheduleTimes } from "../lib/schedule-utils.js";
import { createCourseCatalog, mapCourseId } from "../lib/course-catalog.js";
import { getCourses } from "./courses.js";
import { getAnnouncements } from "./announcements.js";
import { getSchedules } from "./schedules.js";
import { getScheduleChanges } from "./scheduleChanges.js";

function assertAdmin(isAdmin) {
  if (!isAdmin) throw new Error("Aksi ini memerlukan sesi admin.");
}

function notifyDataChanged() {
  window.dispatchEvent(new Event("tumpukan:admin-data-change"));
}

function throwIfError(error) {
  if (error) throw error;
}

function filePath(courseId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${courseId}/${crypto.randomUUID()}-${safeName}`;
}

function mapMaterial(row, courseIdentity, url) {
  return {
    id: row.id,
    courseId: mapCourseId(row.course_id, null, courseIdentity.courseIdAliases),
    title: row.title,
    filePath: row.file_path,
    fileName: row.file_name,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    status: row.status,
    submittedBy: row.submitted_by,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    url,
  };
}

export async function getAdminData(isAdmin) {
  assertAdmin(isAdmin);
  const supabase = getSupabaseClient();
  const [courses, tasks, schedules, scheduleChanges, materialsResult, identity] = await Promise.all([
    getCourses(),
    getAnnouncements(),
    getSchedules(),
    getScheduleChanges(),
    supabase
      .from("materials")
      .select("id, course_id, title, file_path, file_name, file_size, mime_type, status, submitted_by, created_at, approved_at")
      .order("created_at", { ascending: false }),
    (async () => {
      const { data, error } = await supabase.from("courses").select("id, name, created_at").order("created_at").order("id");
      throwIfError(error);
      return createCourseCatalog(data);
    })(),
  ]);
  throwIfError(materialsResult.error);

  const materials = await Promise.all(materialsResult.data.map(async (row) => {
    const bucket = row.status === "pending" ? "submissions" : "materials";
    let url = "";
    if (row.status === "pending") {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(row.file_path, 3600);
      throwIfError(error);
      url = data.signedUrl;
    } else {
      url = supabase.storage.from(bucket).getPublicUrl(row.file_path).data.publicUrl;
    }
    return mapMaterial(row, identity, url);
  }));

  return { courses, tasks, schedules, scheduleChanges, materials };
}

export async function saveCourse(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!input.name?.trim()) throw new Error("Nama mata kuliah wajib diisi.");
  if (input.credits && (Number(input.credits) < 1 || Number(input.credits) > 6)) throw new Error("SKS harus antara 1 dan 6.");
  const values = {
    name: input.name.trim(),
    lecturer: input.lecturer?.trim() || null,
    credits: input.credits ? Number(input.credits) : null,
    sort_order: Number(input.sortOrder) || 0,
    color: input.color || "sage",
  };
  const query = getSupabaseClient().from("courses");
  const result = input.id
    ? await query.update(values).eq("id", input.id).select("id").single()
    : await query.insert(values).select("id").single();
  throwIfError(result.error);
  notifyDataChanged();
  return result.data;
}

export async function deleteCourse(courseId, isAdmin) {
  assertAdmin(isAdmin);
  const supabase = getSupabaseClient();
  const { data: currentCourses, error: coursesError } = await supabase.from("courses").select("id, name, created_at");
  throwIfError(coursesError);
  const identity = createCourseCatalog(currentCourses);
  const canonicalId = identity.courseIdAliases.get(courseId);
  const courseIds = [...identity.courseIdAliases]
    .filter(([, aliasId]) => aliasId === canonicalId)
    .map(([id]) => id);
  if (!courseIds.length) throw new Error("Mata kuliah tidak ditemukan.");

  const { data: linkedMaterials, error: materialsError } = await supabase
    .from("materials")
    .select("file_path, status")
    .in("course_id", courseIds);
  throwIfError(materialsError);

  const { data: deletedCourses, error } = await supabase.from("courses").delete().in("id", courseIds).select("id");
  throwIfError(error);
  if (deletedCourses.length !== courseIds.length) throw new Error("Mata kuliah tidak terhapus. Periksa sesi dan izin admin.");

  for (const status of ["approved", "pending"]) {
    const paths = linkedMaterials
      .filter((material) => material.status === status && material.file_path)
      .map((material) => material.file_path);
    if (!paths.length) continue;
    const bucket = status === "pending" ? "submissions" : "materials";
    const { error: storageError } = await supabase.storage.from(bucket).remove(paths);
    throwIfError(storageError);
  }
  notifyDataChanged();
}

export async function saveTask(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!input.title?.trim()) throw new Error("Judul tugas wajib diisi.");
  const deadline = input.deadlineLocal ? new Date(`${input.deadlineLocal}:00+07:00`) : null;
  if (deadline && Number.isNaN(deadline.getTime())) throw new Error("Tanggal deadline tidak valid.");
  const values = {
    course_id: input.courseId || null,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    deadline: deadline?.toISOString() ?? null,
    submission_method: input.submissionMethod?.trim() || null,
    updated_at: new Date().toISOString(),
  };
  const query = getSupabaseClient().from("announcements");
  const result = input.id
    ? await query.update(values).eq("id", input.id).select("id").single()
    : await query.insert(values).select("id").single();
  throwIfError(result.error);
  notifyDataChanged();
  return result.data;
}

export async function deleteTask(taskId, isAdmin) {
  assertAdmin(isAdmin);
  const { data, error } = await getSupabaseClient().from("announcements").delete().eq("id", taskId).select("id");
  throwIfError(error);
  if (!data.length) throw new Error("Tugas tidak ditemukan atau tidak dapat dihapus.");
  notifyDataChanged();
}

export async function deleteOverdueTasks(isAdmin) {
  assertAdmin(isAdmin);
  const { error } = await getSupabaseClient()
    .from("announcements")
    .delete()
    .not("deadline", "is", null)
    .lt("deadline", new Date().toISOString());
  throwIfError(error);
  notifyDataChanged();
}

export async function saveSchedule(input, isAdmin) {
  assertAdmin(isAdmin);
  const timeError = validateScheduleTimes(input.startTime, input.endTime);
  if (timeError) throw new Error(timeError);
  if (!input.courseId || !input.dayOfWeek) throw new Error("Mata kuliah dan hari wajib dipilih.");
  if (input.startsOn && input.endsOn && input.endsOn < input.startsOn) throw new Error("Tanggal akhir harus sama atau setelah tanggal mulai.");
  const values = {
    course_id: input.courseId,
    day_of_week: Number(input.dayOfWeek),
    start_time: input.startTime,
    end_time: input.endTime,
    room: input.room?.trim() || null,
    starts_on: input.startsOn || null,
    ends_on: input.endsOn || null,
  };
  const query = getSupabaseClient().from("schedules");
  const result = input.id
    ? await query.update(values).eq("id", input.id).select("id").single()
    : await query.insert(values).select("id").single();
  throwIfError(result.error);
  notifyDataChanged();
  return result.data;
}

export async function deleteSchedule(scheduleId, isAdmin) {
  assertAdmin(isAdmin);
  const { data, error } = await getSupabaseClient().from("schedules").delete().eq("id", scheduleId).select("id");
  throwIfError(error);
  if (!data.length) throw new Error("Jadwal tidak ditemukan atau tidak dapat dihapus.");
  notifyDataChanged();
}

export async function saveScheduleChange(input, isAdmin) {
  assertAdmin(isAdmin);
  const [schedules, scheduleChanges] = await Promise.all([getSchedules(), getScheduleChanges()]);
  const schedule = schedules.find((item) => item.id === input.scheduleId);
  const validationError = validateScheduleChange(input, scheduleChanges, schedules);
  if (validationError) throw new Error(validationError);
  if (input.kind !== "extra" && !schedule) throw new Error("Jadwal asal tidak ditemukan.");
  const values = {
    kind: input.kind,
    course_id: input.kind === "extra" ? input.courseId : schedule.courseId,
    schedule_id: input.kind === "extra" ? null : schedule.id,
    original_date: input.kind === "extra" ? null : input.originalDate,
    new_date: input.kind === "cancelled" ? null : input.newDate,
    start_time: input.kind === "cancelled" ? null : input.startTime || schedule?.startTime || null,
    end_time: input.kind === "cancelled" ? null : input.endTime || schedule?.endTime || null,
    room: input.kind === "cancelled" ? null : input.room?.trim() || schedule?.room || null,
    note: input.note?.trim() || null,
  };
  const query = getSupabaseClient().from("schedule_changes");
  const result = input.id
    ? await query.update(values).eq("id", input.id).select("id").single()
    : await query.insert(values).select("id").single();
  throwIfError(result.error);
  notifyDataChanged();
  return result.data;
}

export async function deleteScheduleChange(changeId, isAdmin) {
  assertAdmin(isAdmin);
  const { data, error } = await getSupabaseClient().from("schedule_changes").delete().eq("id", changeId).select("id");
  throwIfError(error);
  if (!data.length) throw new Error("Perubahan jadwal tidak ditemukan atau tidak dapat dihapus.");
  notifyDataChanged();
}

export async function saveMaterial(input, isAdmin) {
  assertAdmin(isAdmin);
  if (!input.courseId || !input.title?.trim()) throw new Error("Mata kuliah dan judul materi wajib diisi.");
  const fileError = validateMaterialFile(input.file);
  if (fileError) throw new Error(fileError);

  const supabase = getSupabaseClient();
  const path = filePath(input.courseId, input.file);
  const { error: uploadError } = await supabase.storage.from("materials").upload(path, input.file, {
    contentType: input.file.type,
    upsert: false,
  });
  throwIfError(uploadError);

  const { data, error } = await supabase.from("materials").insert({
    course_id: input.courseId,
    title: input.title.trim(),
    file_path: path,
    file_name: input.file.name,
    file_size: input.file.size,
    mime_type: input.file.type,
    status: "approved",
    approved_at: new Date().toISOString(),
  }).select("id").single();
  if (error) {
    const { error: cleanupError } = await supabase.storage.from("materials").remove([path]);
    if (cleanupError) throw new Error(`Materi gagal disimpan dan file sementara gagal dibersihkan: ${cleanupError.message}`);
    throw error;
  }
  notifyDataChanged();
  return data;
}

export async function updateMaterialDetails(materialId, updates, isAdmin) {
  assertAdmin(isAdmin);
  if (!updates.title?.trim() || !updates.courseId) throw new Error("Judul dan mata kuliah wajib diisi.");
  const { data, error } = await getSupabaseClient().from("materials").update({
    title: updates.title.trim(),
    course_id: updates.courseId,
  }).eq("id", materialId).select("id").single();
  throwIfError(error);
  notifyDataChanged();
  return data;
}

export async function approveMaterial(materialId, updates, isAdmin) {
  assertAdmin(isAdmin);
  if (!updates.title?.trim() || !updates.courseId) throw new Error("Judul dan mata kuliah wajib diisi sebelum menyetujui.");

  const supabase = getSupabaseClient();
  const { data: row, error: lookupError } = await supabase.from("materials")
    .select("id, file_path, file_name, mime_type")
    .eq("id", materialId)
    .eq("status", "pending")
    .single();
  throwIfError(lookupError);

  const source = supabase.storage.from("submissions");
  const destination = supabase.storage.from("materials");
  const { data: file, error: downloadError } = await source.download(row.file_path);
  throwIfError(downloadError);
  const path = filePath(updates.courseId, { name: row.file_name });
  const { error: uploadError } = await destination.upload(path, file, {
    contentType: row.mime_type || file.type,
    upsert: false,
  });
  throwIfError(uploadError);

  const { error: updateError } = await supabase.from("materials").update({
    course_id: updates.courseId,
    title: updates.title.trim(),
    file_path: path,
    status: "approved",
    approved_at: new Date().toISOString(),
  }).eq("id", materialId).eq("status", "pending");
  if (updateError) {
    const { error: cleanupError } = await destination.remove([path]);
    if (cleanupError) throw new Error(`Persetujuan gagal dan file tujuan gagal dibersihkan: ${cleanupError.message}`);
    throw updateError;
  }

  const { error: sourceCleanupError } = await source.remove([row.file_path]);
  notifyDataChanged();
  if (sourceCleanupError) throw new Error(`Materi sudah disetujui, tetapi file kiriman lama gagal dibersihkan: ${sourceCleanupError.message}`);
}

export async function removeMaterial(materialId, isAdmin) {
  assertAdmin(isAdmin);
  const supabase = getSupabaseClient();
  const { data: row, error: lookupError } = await supabase.from("materials")
    .select("id, file_path, status")
    .eq("id", materialId)
    .single();
  throwIfError(lookupError);

  const { data, error } = await supabase.from("materials").delete().eq("id", materialId).select("id");
  throwIfError(error);
  if (!data.length) throw new Error("Materi tidak ditemukan atau tidak dapat dihapus.");

  const bucket = row.status === "pending" ? "submissions" : "materials";
  const { error: storageError } = await supabase.storage.from(bucket).remove([row.file_path]);
  notifyDataChanged();
  if (storageError) throw new Error(`Data materi dihapus, tetapi file di Storage gagal dibersihkan: ${storageError.message}`);
}
