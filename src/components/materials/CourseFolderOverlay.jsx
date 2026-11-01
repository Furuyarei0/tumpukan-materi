import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { BookOpen, Download, FileText } from "lucide-react";
import { useMaterials } from "../../hooks/useMaterials.js";
import { isPdfMaterial } from "../../lib/materials.js";
import { OverlayShell } from "../ui/OverlayShell.jsx";

const PdfViewer = lazy(() => import("../viewer/PdfViewer.jsx"));

function MaterialRows({ materials, onOpenMaterial }) {
  return (
    <div className="material-rows">
      {materials.map((material) => (
        isPdfMaterial(material) ? (
          <button id={`material-${material.id}`} className="material-row material-row-button" key={material.id} type="button" onClick={() => onOpenMaterial(material.id)}>
            <span className="material-file-icon"><FileText size={19} aria-hidden="true" /></span>
            <span className="material-row-copy">
              <strong>{material.title}</strong>
              <small>PDF · {material.fileName}</small>
            </span>
            <FileText size={18} aria-hidden="true" />
          </button>
        ) : (
          <a className="material-row" href={material.url} key={material.id} download={material.fileName}>
            <span className="material-file-icon"><FileText size={19} aria-hidden="true" /></span>
            <span className="material-row-copy">
              <strong>{material.title}</strong>
              <small>{material.fileName}</small>
            </span>
            <Download size={18} aria-hidden="true" />
          </a>
        )
      ))}
    </div>
  );
}

export function CourseFolderOverlay({
  open,
  onClose,
  course,
  layoutId,
  onOpenSubmit,
  selectedMaterialId,
  onOpenMaterial,
  onCloseMaterial,
  isAdmin = false,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onEditCourse,
  onDeleteCourse,
}) {
  const { data: materials, isLoading, error } = useMaterials(course?.id ?? null, open);
  const titleId = useMemo(() => `course-folder-title-${course?.id ?? "missing"}`, [course?.id]);
  const selectedMaterial = materials.find((material) => material.id === selectedMaterialId);
  const showingPreview = Boolean(selectedMaterialId);
  const previousMaterialId = useRef(selectedMaterialId);

  useEffect(() => {
    if (previousMaterialId.current && !selectedMaterialId) {
      document.getElementById(`material-${previousMaterialId.current}`)?.focus();
    }
    previousMaterialId.current = selectedMaterialId;
  }, [selectedMaterialId]);

  return (
    <OverlayShell
      open={open}
      onClose={onClose}
      titleId={titleId}
      layoutId={layoutId}
      panelClassName={`course-folder-panel${showingPreview ? " course-folder-panel-viewer" : ""}`}
    >
      {showingPreview ? (
        isLoading ? (
          <div className="pdf-preview-loading" role="status">
            <h2 className="sr-only" id={titleId}>Memuat pratinjau {course?.name ?? "materi"}</h2>
            Memuat materi…
          </div>
        ) : selectedMaterial ? (
          <Suspense fallback={(
            <div className="pdf-preview-loading" role="status">
              <h2 className="sr-only" id={titleId}>Menyiapkan pratinjau {selectedMaterial.title}</h2>
              Menyiapkan pratinjau…
            </div>
          )}>
            <PdfViewer key={selectedMaterial.id} material={selectedMaterial} titleId={titleId} onClose={onCloseMaterial} />
          </Suspense>
        ) : (
          <div className="folder-preview-error" role={error ? "alert" : "status"}>
            <h2 className="sr-only" id={titleId}>Pratinjau materi</h2>
            <p>{error ? "Materi belum bisa dimuat." : "Materi tidak ditemukan atau belum disetujui."}</p>
            <button type="button" className="button-secondary" onClick={onCloseMaterial}>Kembali ke folder</button>
          </div>
        )
      ) : (
        <>
          <div className={`folder-cover ${course ? `course-${course.color}` : ""}`}>
            <span className="folder-symbol"><BookOpen size={22} aria-hidden="true" /> Folder mata kuliah</span>
            <h2 id={titleId}>{course?.name ?? "Mata kuliah tidak ditemukan"}</h2>
            {course && (
              <>
                <div className="folder-meta">
                  <span>{course.lecturer}</span>
                  <span>{course.credits} SKS</span>
                </div>
                {isAdmin && (
                  <div className="folder-course-admin-actions">
                    <button type="button" className="admin-text-button" onClick={() => onEditCourse(course)}>Ubah mata kuliah</button>
                    <button type="button" className="admin-text-button danger" onClick={() => onDeleteCourse(course)}>Hapus mata kuliah</button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="folder-content">
            <div className="folder-content-heading">
              <h3>Materi kuliah</h3>
              <span>{materials.length} materi</span>
              {isAdmin && course && <button type="button" className="admin-text-button" onClick={() => onAddMaterial(course.id)}>Tambah materi</button>}
            </div>
            {isLoading ? (
              <div className="material-skeleton" role="status"><span /><span /><span /></div>
            ) : error ? (
              <p className="inline-error" role="alert">Materi belum bisa dimuat. Coba muat ulang halaman.</p>
            ) : materials.length ? (
              <>
                <MaterialRows materials={materials} onOpenMaterial={onOpenMaterial} />
                {isAdmin && materials.map((material) => (
                  <div className="folder-admin-actions" key={`actions-${material.id}`}>
                    <span>{material.title}</span>
                    <button type="button" className="admin-text-button" onClick={() => onEditMaterial(material)}>Ubah</button>
                    <button type="button" className="admin-text-button danger" onClick={() => onDeleteMaterial(material)}>Hapus</button>
                  </div>
                ))}
              </>
            ) : (
              <div className="folder-empty">
                <span className="empty-file"><FileText size={27} aria-hidden="true" /></span>
                <strong>Belum ada materi di sini.</strong>
                <p>Kalau punya catatan atau bahan kuliah, kamu bisa mengirimkannya untuk ditinjau admin.</p>
                {isAdmin && course && <button type="button" className="button-secondary" onClick={() => onAddMaterial(course.id)}>Tambah materi</button>}
                <button type="button" className="button-primary" onClick={() => onOpenSubmit(course?.id ?? "new")}>Kirim materi</button>
              </div>
            )}
          </div>
        </>
      )}
    </OverlayShell>
  );
}
