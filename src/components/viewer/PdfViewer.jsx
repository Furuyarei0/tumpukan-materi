import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";

function PdfPage({ pdf, pageNumber }) {
  const pageRef = useRef(null);
  const canvasRef = useRef(null);
  const [pageError, setPageError] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1 / 1.414");
  const isRenderingRef = useRef(false);
  const hasRenderedRef = useRef(false);
  const renderTaskRef = useRef(null);

  // Ambil rasio aspek halaman dari dokumen PDF
  useEffect(() => {
    let active = true;
    pdf.getPage(pageNumber).then((page) => {
      if (active) {
        const vp = page.getViewport({ scale: 1 });
        if (vp.width && vp.height) {
          setAspectRatio(`${vp.width} / ${vp.height}`);
        }
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [pdf, pageNumber]);

  useEffect(() => {
    let cancelled = false;

    async function renderPage() {
      if (isRenderingRef.current || hasRenderedRef.current || cancelled) return;
      isRenderingRef.current = true;
      setPageError(false);

      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const container = pageRef.current;
        if (!canvas || !container) return;

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Peramban tidak mendukung canvas.");

        // Lebar tampilan di layar (CSS pixels)
        const containerWidth = Math.max(container.clientWidth || 600, 280);
        const baseViewport = page.getViewport({ scale: 1 });

        // Rasio piksel layar (mendukung Windows scaling 125%/150% dan Retina display)
        const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);

        // Skala CSS: sesuaikan PDF dengan lebar kontainer
        const cssScale = containerWidth / baseViewport.width;

        // Skala render fisik: dikali pixelRatio agar bitmap tajam
        const renderScale = cssScale * pixelRatio;
        const viewport = page.getViewport({ scale: renderScale });

        // Ukuran bitmap kanvas fisik (piksel nyata di layar)
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Biarkan CSS yang mengatur ukuran tampilan (width:100%, height:auto via stylesheet)
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.style.display = "block";

        // Latar putih bersih
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });
        renderTaskRef.current = renderTask;

        await renderTask.promise;

        if (!cancelled) {
          hasRenderedRef.current = true;
          setRendered(true);
        }
      } catch (renderError) {
        if (renderError?.name !== "RenderingCancelledException" && !cancelled) {
          console.error(`Gagal merender halaman PDF #${pageNumber}:`, renderError);
          setPageError(true);
        }
      } finally {
        isRenderingRef.current = false;
        renderTaskRef.current = null;
      }
    }

    let observer;
    if ("IntersectionObserver" in window && pageRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && !hasRenderedRef.current) {
            renderPage();
            observer.disconnect();
          }
        },
        { rootMargin: "300px 0px" },
      );
      observer.observe(pageRef.current);
    } else {
      renderPage();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pageNumber, pdf]);

  return (
    <section
      className="pdf-page"
      ref={pageRef}
      style={!rendered ? { aspectRatio } : undefined}
      aria-label={`Halaman ${pageNumber}`}
    >
      {!rendered && !pageError && <div className="pdf-page-skeleton" aria-hidden="true" />}
      <canvas
        ref={canvasRef}
        style={{ display: rendered ? "block" : "none", width: "100%", height: "auto" }}
        aria-label={`Pratinjau halaman ${pageNumber}`}
      />
      {pageError && (
        <p className="pdf-page-error" role="alert">
          Halaman {pageNumber} tidak dapat dimuat.
        </p>
      )}
    </section>
  );
}

export default function PdfViewer({ material, titleId, onClose }) {
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const activeDocument = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButton.current?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPdf(null);
    setIsLoading(true);
    setError("");

    async function loadPdf() {
      try {
        const [pdfjs, worker] = await Promise.all([
          import("pdfjs-dist"),
          import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        ]);
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const loadingTask = pdfjs.getDocument(material.url);
        const document = await loadingTask.promise;
        if (cancelled) {
          await document.destroy();
          return;
        }
        activeDocument.current = document;
        setPdf(document);
      } catch (err) {
        if (!cancelled) {
          console.error("PDF load error:", err);
          setError("PDF tidak dapat dibuka. Unduh file untuk mencobanya di aplikasi lain.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
      const document = activeDocument.current;
      activeDocument.current = null;
      if (document) {
        document.destroy().catch((destroyError) => {
          console.error("PDF viewer cleanup failed.", destroyError);
        });
      }
    };
  }, [material.url]);

  return (
    <section className="pdf-viewer" aria-label={`Pratinjau PDF ${material.title}`}>
      <header className="pdf-toolbar">
        <button
          ref={closeButton}
          type="button"
          className="button-secondary pdf-close"
          onClick={onClose}
          aria-label="Tutup pratinjau PDF"
        >
          <X size={17} aria-hidden="true" />
          Tutup
        </button>
        <div className="pdf-toolbar-title">
          <strong id={titleId}>{material.title}</strong>
          {pdf && <span>{pdf.numPages} halaman</span>}
        </div>
        <a className="button-primary pdf-download" href={material.url} download={material.fileName}>
          <Download size={17} aria-hidden="true" />
          Unduh
        </a>
      </header>
      <div className="pdf-pages" aria-busy={isLoading}>
        {isLoading ? (
          <div className="pdf-document-skeleton" role="status">
            Memuat PDF…
          </div>
        ) : error ? (
          <div className="pdf-load-error" role="alert">
            <p>{error}</p>
            <a className="button-primary" href={material.url} download={material.fileName}>
              Unduh PDF
            </a>
          </div>
        ) : (
          Array.from({ length: pdf.numPages }, (_, index) => (
            <PdfPage key={`${material.id}-${index + 1}`} pdf={pdf} pageNumber={index + 1} />
          ))
        )}
      </div>
    </section>
  );
}
