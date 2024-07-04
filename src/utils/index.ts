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

export function getHorizontalAlign({
  x,
  line,
  rect,
  fieldRef,
}: {
  x: number;
  line: RulerLine;
  rect: DOMRect;
  fieldRef: HTMLDivElement;
}) {
  const centerX = x + fieldRef.offsetWidth / 2;
  const left = x - rect.left;
  const right = x + fieldRef.offsetWidth;
  switch (true) {
    case line.x - 10 < left && line.x + 10 > left:
      return line.x;
    case line.x - 10 < centerX && line.x + 10 > centerX:
      return line.x - fieldRef.offsetWidth / 2;
    case line.x - 10 < right && line.x + 10 > right:
      return line.x - fieldRef.offsetWidth;
    default:
      return null;
  }
}

export function getVerticalAlign({
  y,
  line,
  rect,
  fieldRef,
}: {
  y: number;
  line: RulerLine;
  rect: DOMRect;
  fieldRef: HTMLDivElement;
}) {
  const centerY = y + fieldRef.offsetHeight / 2;
  const top = y - rect.top;
  const bottom = y + fieldRef.offsetHeight;
  switch (true) {
    case line.y - 10 < top && line.y + 10 > top:
      return line.y;
    case line.y - 10 < centerY && line.y + 10 > centerY:
      return line.y - fieldRef.offsetHeight / 2;
    case line.y - 10 < bottom && line.y + 10 > bottom:
      return line.y - fieldRef.offsetHeight;
    default:
      return null;
  }
}
