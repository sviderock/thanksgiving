import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onCloneNode(cloned: Node) {
  const el = cloned as HTMLElement;
  el.querySelectorAll(".field-wrapper").forEach((el) => {
    (el as HTMLElement).style.setProperty("overflow", "visible");
  });
}

export function detectDoubleTap(doubleTapMs = 200) {
  let timeout: number;
  let lastTap = 0;
  let target: EventTarget | null;
  return function detectDoubleTap(e: PointerEvent) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (0 < tapLength && tapLength < doubleTapMs && target === e.target) {
      e.preventDefault();
      const doubleTap = new CustomEvent("doubletap", {
        bubbles: true,
        detail: e,
      });
      e.target?.dispatchEvent(doubleTap);
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), doubleTapMs);
      target = e.target;
    }
    lastTap = currentTime;
  };
}
