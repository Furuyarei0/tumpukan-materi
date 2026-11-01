import { useState } from "react";
import { useAnnouncements } from "../hooks/useAnnouncements.js";
import { useCourses } from "../hooks/useCourses.js";
import { useHashRoute } from "../hooks/useHashRoute.js";
import { useSchedules } from "../hooks/useSchedules.js";
import { useScheduleChanges } from "../hooks/useScheduleChanges.js";
import { useAdminSession } from "../hooks/useAdminSession.js";
import { useAdminData } from "../hooks/useAdminData.js";
import { Navbar } from "../components/nav/Navbar.jsx";
import { Hero } from "../components/hero/Hero.jsx";
import { TaskBoard } from "../components/board/TaskBoard.jsx";
import { CourseDeck } from "../components/deck/CourseDeck.jsx";
import { CourseFolderOverlay } from "../components/materials/CourseFolderOverlay.jsx";
import { TaskDetailOverlay } from "../components/board/TaskDetailOverlay.jsx";
import { SubmitMaterialOverlay } from "../components/submit/SubmitMaterialOverlay.jsx";
import { AdminWorkspace } from "../components/admin/AdminWorkspace.jsx";
import { AdminEditorOverlay } from "../components/admin/AdminEditorOverlay.jsx";
import { AdminConfirmOverlay } from "../components/admin/AdminConfirmOverlay.jsx";
import { AdminPasswordRecovery } from "../components/admin/AdminPasswordRecovery.jsx";
import {
  approveMaterial,
  deleteCourse,
  deleteSchedule,
  deleteScheduleChange,
  deleteTask,
  removeMaterial,
  updateMaterialDetails,
} from "../services/admin.js";
import { isPdfMaterial } from "../lib/materials.js";
import { sendAdminPasswordReset } from "../services/auth.js";

export function Home() {
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: schedules, isLoading: schedulesLoading, error: schedulesError } = useSchedules();
  const {
    data: scheduleChanges,
    isLoading: scheduleChangesLoading,
    error: scheduleChangesError,
  } = useScheduleChanges();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useAnnouncements();
  const { route, openRoute, openCourseMaterial, closeCourseMaterial, closeRoute, goHome } = useHashRoute();
  const {
    isAdmin,
    isLoading: authLoading,
    error: authError,
    signIn,
    signOut,
    updatePassword,
    isPasswordRecovery,
    isSimulated,
  } = useAdminSession();
  const adminResource = useAdminData(isAdmin);
  const [editor, setEditor] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [adminActionError, setAdminActionError] = useState("");
  const adminData = Array.isArray(adminResource.data)
    ? { courses: [], schedules: [], tasks: [], materials: [], scheduleChanges: [] }
    : adminResource.data;
  const activeCourse = route?.type === "course" ? courses.find((course) => course.id === route.id) : null;
  const activeTask = route?.type === "task" ? tasks.find((task) => task.id === route.id) : null;

  function openSearchMaterial(material) {
    if (isPdfMaterial(material)) {
      openCourseMaterial(material.courseId, material.id);
      return;
    }

    openRoute("course", material.courseId);
    const link = document.createElement("a");
    link.href = material.url;
    link.download = material.fileName;
    document.body.append(link);
    link.click();
    link.remove();
  }

  function createEditor(type, record = {}) {
    setEditor({ type, record });
  }

  function requestDelete(type, record) {
    const actionLabel = type === "material" ? (record.status === "pending" ? "Tolak kiriman" : "Hapus materi") : "Hapus";
    const title = type === "material" && record.status === "pending" ? "Tolak kiriman ini?" : `Hapus ${type === "course" ? "mata kuliah" : type === "task" ? "tugas" : type === "schedule" ? "jadwal" : type === "scheduleChange" ? "perubahan jadwal" : "materi"}?`;
    const linkedMaterialCount = type === "course"
      ? adminData.materials.filter((material) => material.courseId === record.id).length
      : 0;
    const message = type === "course"
      ? `Mata kuliah beserta ${linkedMaterialCount} materi dan jadwal yang terkait akan dihapus.`
      : type === "material" ? "Baris materi dan file terkait akan dihapus." : "Tindakan ini tidak dapat dibatalkan.";
    setConfirmation({ type, record, title, actionLabel, message });
  }

  async function performConfirmation(value) {
    setAdminActionError("");
    if (value.type === "course") await deleteCourse(value.record.id, isAdmin);
    if (value.type === "task") await deleteTask(value.record.id, isAdmin);
    if (value.type === "schedule") await deleteSchedule(value.record.id, isAdmin);
    if (value.type === "scheduleChange") await deleteScheduleChange(value.record.id, isAdmin);
    if (value.type === "material") await removeMaterial(value.record.id, isAdmin);
    setConfirmation(null);
    if (route?.type === "task" || route?.type === "course") closeRoute();
  }

  function openAdmin(section = "dashboard") {
    openRoute("admin", section);
  }

  async function logout() {
    setAdminActionError("");
    try {
      await signOut();
      openRoute("admin", "dashboard");
    } catch {
      setAdminActionError("Sesi admin belum bisa ditutup. Periksa koneksi lalu coba lagi.");
    }
  }

  if (isPasswordRecovery) {
    return (
      <AdminPasswordRecovery
        onUpdatePassword={updatePassword}
        onComplete={() => openRoute("admin")}
        onCancel={logout}
      />
    );
  }

  if (route?.type === "admin") {
    return (
      <>
        <AdminWorkspace
          isAdmin={isAdmin}
          signIn={signIn}
          onPasswordReset={sendAdminPasswordReset}
          onLogout={logout}
          section={route.id}
          onSelect={openAdmin}
          data={adminData}
          onCreate={(type) => createEditor(type)}
          onEdit={createEditor}
          onDelete={requestDelete}
          onApprove={(id, updates) => approveMaterial(id, updates, isAdmin)}
          onReject={requestDelete}
          onUpdatePending={(id, updates) => updateMaterialDetails(id, updates, isAdmin)}
          onBack={goHome}
          isLoading={adminResource.isLoading}
          authLoading={authLoading}
          authError={authError || adminActionError}
          isSimulated={isSimulated}
        />
        {adminResource.error && <p className="admin-global-error" role="alert">Data admin belum bisa dimuat. Muat ulang halaman untuk mencoba lagi.</p>}
        <AdminEditorOverlay
          editor={editor}
          courses={adminData.courses}
          schedules={adminData.schedules}
          isAdmin={isAdmin}
          onClose={() => setEditor(null)}
          onSaved={() => setEditor(null)}
        />
        <AdminConfirmOverlay confirmation={confirmation} onClose={() => setConfirmation(null)} onConfirm={performConfirmation} />
      </>
    );
  }

  return (
    <>
      <Navbar
        isAdmin={isAdmin}
        onOpenSubmit={(id) => openRoute("submit", id)}
        onOpenAdmin={() => openAdmin()}
        onLogout={logout}
      />
      <main>
        <Hero
          courses={courses}
          schedules={schedules}
          isLoading={coursesLoading || schedulesLoading}
          error={coursesError || schedulesError}
        />
        <TaskBoard
          tasks={tasks}
          tasksLoading={tasksLoading}
          tasksError={tasksError}
          onOpenTask={(id) => openRoute("task", id)}
          courses={courses}
          schedules={schedules}
          scheduleChanges={scheduleChanges}
          scheduleLoading={schedulesLoading || scheduleChangesLoading}
          scheduleError={schedulesError || scheduleChangesError}
          isAdmin={isAdmin}
          onAddTask={() => createEditor("task")}
          onAddSchedule={() => createEditor("schedule")}
          onEditSchedule={(id) => createEditor("schedule", adminData.schedules.find((schedule) => schedule.id === id))}
          onDeleteSchedule={(id) => {
            const schedule = adminData.schedules.find((item) => item.id === id);
            if (schedule) requestDelete("schedule", schedule);
          }}
          onAddScheduleChange={() => createEditor("scheduleChange")}
          onDeleteScheduleChange={(id) => requestDelete("scheduleChange", adminData.scheduleChanges.find((change) => change.id === id))}
        />
        <CourseDeck
          courses={courses}
          isLoading={coursesLoading}
          error={coursesError}
          onOpenCourse={(id) => openRoute("course", id)}
          onOpenSearchMaterial={openSearchMaterial}
          interactionEnabled={!route}
          isAdmin={isAdmin}
          onAddCourse={() => createEditor("course")}
          onEditCourse={(course) => createEditor("course", course)}
          onDeleteCourse={(course) => requestDelete("course", course)}
        />
      </main>
      <CourseFolderOverlay
        open={route?.type === "course"}
        onClose={closeRoute}
        course={activeCourse}
        layoutId={activeCourse ? `course-card-${activeCourse.id}` : undefined}
        onOpenSubmit={(id) => openRoute("submit", id)}
        selectedMaterialId={route?.materialId}
        onOpenMaterial={(id) => openCourseMaterial(activeCourse?.id, id)}
        onCloseMaterial={closeCourseMaterial}
        isAdmin={isAdmin}
        onAddMaterial={(courseId) => createEditor("material", { courseId })}
        onEditMaterial={(record) => createEditor("material", record)}
        onDeleteMaterial={(record) => requestDelete("material", record)}
        onEditCourse={(course) => createEditor("course", course)}
        onDeleteCourse={(course) => requestDelete("course", course)}
      />
      <TaskDetailOverlay
        open={route?.type === "task"}
        onClose={closeRoute}
        task={activeTask}
        isAdmin={isAdmin}
        onOpenCourse={(id) => openRoute("course", id)}
        onEdit={(id) => {
          const task = tasks.find((item) => item.id === id);
          closeRoute();
          createEditor("task", task);
        }}
        onDelete={(id) => {
          const task = tasks.find((item) => item.id === id);
          if (task) requestDelete("task", task);
        }}
      />
      <SubmitMaterialOverlay
        open={route?.type === "submit"}
        onClose={closeRoute}
        courses={courses}
        initialCourseId={route?.type === "submit" && route.id !== "new" ? route.id : ""}
      />
      <AdminEditorOverlay
        editor={editor}
        courses={adminData.courses}
        schedules={adminData.schedules}
        isAdmin={isAdmin}
        onClose={() => setEditor(null)}
        onSaved={() => setEditor(null)}
      />
      <AdminConfirmOverlay confirmation={confirmation} onClose={() => setConfirmation(null)} onConfirm={performConfirmation} />
    </>
  );
}
