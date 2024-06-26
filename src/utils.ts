import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterDom(el: Node) {
  const elem = el as HTMLElement;
  if (elem.classList?.contains("field-wrapper")) {
    console.log(elem);
    elem.style.setProperty("overflow", "visible");
  }
  return true;
}
