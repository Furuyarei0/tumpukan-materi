import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useOverlayA11y(isOpen, onClose, panelRef, initialFocusRef) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const inertTargets = [...document.querySelectorAll("main, .site-nav")].map((element) => ({
      element,
      wasInert: element.inert,
    }));
    document.body.style.overflow = "hidden";
    inertTargets.forEach(({ element }) => { element.inert = true; });
    (initialFocusRef?.current ?? panelRef.current)?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)]
        .filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach(({ element, wasInert }) => { element.inert = wasInert; });
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen, panelRef, initialFocusRef]);
}
