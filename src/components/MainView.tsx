"use client";

import Actions from "@/components/Actions";
import DragButton from "@/components/DragButton";
import Ruler from "@/components/Ruler";
import TextareaField from "@/components/TextareaField";
import { detectDoubleTap, getHorizontalAlign, getVerticalAlign } from "@/utils";
import { useStore } from "@/utils/state";
import "core-js/actual/array/with";
import { useEffect, useRef, useState } from "react";

function isDoubleTap(e: unknown): e is CustomEvent {
  return (e as CustomEvent)?.type === "doubletap";
}

export default function MainView() {
  const { fields, addField, updateField, deleteField, setFields, ruler, lines } = useStore();
  const [draggingIdx, setDraggingIdx] = useState<string | null>(null);
  const [newPos, setNewPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragData = draggingIdx ? fields[+draggingIdx] : null;

  function createField(e: React.MouseEvent<HTMLDivElement> | CustomEvent) {
    e.stopPropagation();

    if ((e.target as HTMLDivElement).parentElement !== ref.current && e.target !== ref.current) {
      return;
    }

    const parentRect = ref.current!.getBoundingClientRect();
    const x = (isDoubleTap(e) ? e.detail.clientX : e.clientX) - parentRect.left;
    const y = (isDoubleTap(e) ? e.detail.clientY : e.clientY) - parentRect.top;
    addField({ x, y });
  }

  useEffect(() => {
    const pointerup = detectDoubleTap();
    const doubletap = (e: Event) => createField(e as CustomEvent);

    document.addEventListener("pointerup", pointerup);
    ref.current?.addEventListener("doubletap", doubletap);
    return () => {
      document.removeEventListener("pointerup", pointerup);
      ref.current?.removeEventListener("doubletap", doubletap);
    };
  }, []);

  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-start overflow-auto">
      <div
        ref={ref}
        className="h-full w-max overflow-auto relative shrink-0"
        onMouseMove={(e) => {
          if (!draggingIdx) return;

          const fieldRef = fieldRefs.current[draggingIdx];
          if (!fieldRef) return;

          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.nativeEvent.x - rect.left - dragData!.dragOffsetX;
          const y = e.nativeEvent.y - rect.top - dragData!.dragOffsetY;
          const snapToLine = lines.reduce<Field["snapToLine"]>(
            (acc, line) => {
              return {
                x: acc.x ?? getHorizontalAlign({ line, x, fieldRef, rect }),
                y: acc.y ?? getVerticalAlign({ line, y, fieldRef, rect }),
              };
            },
            { x: null, y: null }
          );

          updateField(+draggingIdx, { snapToLine });
          setNewPos({ x, y });
        }}
        onMouseUp={() => {
          if (!draggingIdx) return;

          updateField(+draggingIdx, {
            x: newPos.x,
            y: newPos.y,
            centerX: newPos.x + dragData!.width / 2,
            centerY: newPos.y + dragData!.height / 2,
          });
          setDraggingIdx(null);
        }}
      >
        <img className="md:h-lvh w-lvw md:w-auto select-none" src="/podyaka_1.jpg" />
        {ruler === "on" && <Ruler />}

        {fields.map((field, idx) => (
          <TextareaField
            key={field.id}
            idx={idx}
            field={field}
            isDragged={`${idx}` === draggingIdx}
            onRef={(ref) => {
              fieldRefs.current[idx] = ref.current;
            }}
            onDelete={() => deleteField(idx)}
            onChange={(data) => updateField(idx, data)}
            onDrag={(e) => {
              setDraggingIdx(`${idx}`);
              const fieldRef = fieldRefs.current[idx];
              if (!fieldRef) return;

              const rect = ref.current!.getBoundingClientRect();
              const fieldRect = fieldRef.getBoundingClientRect();
              const x = e.nativeEvent.x - rect.x - (e.nativeEvent.x - fieldRect.x);
              const y = e.nativeEvent.y - rect.y - (e.nativeEvent.y - fieldRect.y);
              const dragOffsetX = e.nativeEvent.x - x;
              const dragOffsetY = e.nativeEvent.y - y;
              updateField(idx, { dragOffsetX, dragOffsetY });
              setNewPos({ x, y });
            }}
          />
        ))}

        {dragData && (
          <div
            className="absolute border-2 leading-none rounded-sm border-slate-500 text-xl z-1000 text-slate-800 break-words rounded-tr-none"
            style={{
              left: `${dragData.snapToLine.x ?? newPos.x}px`,
              top: `${dragData.snapToLine.y ?? newPos.y}px`,
              width: `${dragData.width}px`,
              height: dragData.height,
              fontSize: `${dragData.fontSize}px`,
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: dragData.value }} />
            <DragButton className="translate-x-[2px] -translate-y-[2px] bg-slate-500" />
          </div>
        )}
      </div>

      <Actions parentRef={ref} fields={fields} onRestore={setFields} />
    </div>
  );
}
