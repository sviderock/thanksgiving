import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface RulerState {
  ruler: "on" | "off";
  toggleRuler: () => void;

  fields: Field[];
  setFields: (fields: Field[]) => void;
  addField: (data: Pick<Field, "x" | "y">) => void;
  deleteField: (idx: number) => void;
  updateField: (idx: number, data: Partial<Field>) => void;

  lines: RulerLine[];
  setLines: (lines: RulerLine[]) => void;
  updateLinePos: (idx: number, data: Partial<RulerLine>) => void;
}

export const useStore = create<RulerState>()((set) => ({
  ruler: "on",
  toggleRuler: () => set((state) => ({ ruler: state.ruler === "on" ? "off" : "on" })),

  fields: [],
  setFields: (fields) => set(() => ({ fields })),
  addField: (data) =>
    set(({ fields }) => ({
      fields: [
        ...fields,
        {
          ...data,
          centerX: data.x + 100,
          centerY: data.y + 15,
          id: uuidv4(),
          value: "",
          width: 200,
          height: 30,
          fontSize: 28,
          dragOffsetX: 0,
          dragOffsetY: 0,
          snapToLine: { x: null, y: null },
        },
      ],
    })),
  deleteField: (idx) =>
    set(({ fields }) => ({ fields: fields.filter((_, fieldIdx) => fieldIdx !== idx) })),
  updateField: (idx, data) =>
    set(({ fields }) => ({ fields: fields.with(idx, { ...fields[idx], ...data }) })),

  lines: [],
  setLines: (lines) => set(() => ({ lines })),
  updateLinePos: (idx, pos) =>
    set(({ lines }) => ({ lines: lines.with(idx, { ...lines[idx], ...pos }) })),
}));
