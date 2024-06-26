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
