import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useOverlayA11y } from "../../hooks/useOverlayA11y.js";

export function OverlayShell({ open, onClose, titleId, layoutId, panelClassName = "", children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useOverlayA11y(open, onClose, panelRef, closeRef);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            layoutId={layoutId}
            className={`overlay-panel ${panelClassName}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0.85, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button ref={closeRef} type="button" className="overlay-close" onClick={onClose} aria-label="Tutup">
              <X size={21} aria-hidden="true" />
            </button>
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
