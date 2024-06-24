"use client";

import CopyToClipboard from "@/components/CopyToClipboard";
import DownloadAsImage from "@/components/DownloadAsImage";
import TextareaField from "@/components/TextareaField";
import { createRef, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function MainView() {
  const [fields, setFields] = useState<Field[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<string | null>(null);
  const [newPos, setNewPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement>>({});
  const dragData = draggingIdx ? fields[+draggingIdx] : null;

  return (
    <div className="flex gap-4">
      <div
        ref={ref}
        className="h-full w-max relative"
        onDoubleClick={(e) => {
          e.stopPropagation();

          if (
            (e.target as HTMLDivElement).parentElement !== ref.current &&
            e.target !== ref.current
          ) {
            return;
          }

          const parentRect = e.currentTarget.getBoundingClientRect();
          setFields((fields) => [
            ...fields,
            {
              id: uuidv4(),
              value: "",
              x: e.clientX - parentRect.left,
              y: e.clientY - parentRect.top,
              width: 200,
              height: 50,
            },
          ]);
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          const fieldIdx = target.dataset.fieldIdx;
          if (!fieldIdx) return;
          setDraggingIdx(fieldIdx);

          const fieldRef = fieldRefs.current[fieldIdx];
          console.log(fieldRefs);
          const rect = e.currentTarget.getBoundingClientRect();
          const fieldRect = fieldRef.getBoundingClientRect();
          setNewPos({
            x: fieldRect.left - rect.left,
            y: fieldRect.top - rect.top,
          });
        }}
        onMouseMove={(e) => {
          if (!draggingIdx) return;

          const fieldRef = fieldRefs.current[draggingIdx];
          const rect = e.currentTarget.getBoundingClientRect();
          const offsetWidth = fieldRef.offsetWidth / 2;
          const offsetHeight = fieldRef.offsetHeight / 2;
          console.log(e.nativeEvent.x, rect.left);
          setNewPos({
            x: e.nativeEvent.x - rect.left - offsetWidth,
            y: e.nativeEvent.y - rect.top - offsetHeight,
          });
        }}
        onMouseUp={() => {
          if (!draggingIdx) return;
          setFields((fields) =>
            fields.with(+draggingIdx, { ...fields[+draggingIdx], x: newPos.x, y: newPos.y })
          );
          setDraggingIdx(null);
        }}
      >
        <img className="h-lvh" src="/podyaka_1.png" />

        {dragData && (
          <div
            className="absolute border-2 border-blue-500"
            style={{
              left: `${newPos.x}px`,
              top: `${newPos.y}px`,
              width: `${dragData.width}px`,
              height: dragData.height,
            }}
          ></div>
        )}

        {fields.map((field, idx) => (
          <TextareaField
            key={field.id}
            idx={idx}
            field={field}
            ref={fieldRefs.current[idx]}
            onChange={(value) => setFields((fields) => fields.with(idx, { ...field, value }))}
            onSizeChange={({ width, height }) => {
              setFields((fields) => fields.with(idx, { ...field, width, height }));
            }}
          />
        ))}
      </div>

      <div className="p-4 flex gap-2 flex-col">
        <CopyToClipboard parentRef={ref} />
        <DownloadAsImage parentRef={ref} />
      </div>
    </div>
  );
}
