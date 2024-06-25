"use client";

import CopyToClipboard from "@/components/CopyToClipboard";
import DownloadAsImage from "@/components/DownloadAsImage";
import TextareaField from "@/components/TextareaField";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function MainView() {
  const [fields, setFields] = useState<Field[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<string | null>(null);
  const [newPos, setNewPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
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
        onMouseMove={(e) => {
          if (!draggingIdx) return;

          const fieldRef = fieldRefs.current[draggingIdx];
          if (!fieldRef) return;

          const rect = e.currentTarget.getBoundingClientRect();
          setNewPos({
            x: e.nativeEvent.x - rect.left,
            y: e.nativeEvent.y - rect.top,
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
        <img className="h-lvh select-none" src="/podyaka_1.png" />

        {fields.map((field, idx) => (
          <TextareaField
            key={field.id}
            idx={idx}
            field={field}
            hidden={`${idx}` === draggingIdx}
            onRef={(ref) => {
              fieldRefs.current[idx] = ref.current;
            }}
            onDelete={() => {
              setFields((fields) => fields.filter((item) => field.id !== item.id));
            }}
            onDrag={(e) => {
              setDraggingIdx(`${idx}`);
              const fieldRef = fieldRefs.current[idx];
              if (!fieldRef) return;

              const rect = ref.current!.getBoundingClientRect();
              const fieldRect = fieldRef.getBoundingClientRect();
              setNewPos({
                x: e.nativeEvent.x - rect.x - (e.nativeEvent.x - fieldRect.x),
                y: e.nativeEvent.y - rect.y - (e.nativeEvent.y - fieldRect.y),
              });
            }}
            onChange={(value) => {
              setFields((fields) => fields.with(idx, { ...field, value }));
            }}
            onSizeChange={({ width, height }) => {
              setFields((fields) =>
                fields.with(idx, {
                  ...field,
                  width: width ?? field.width,
                  height: height ?? field.height,
                })
              );
            }}
          />
        ))}

        {dragData && (
          <div
            className="absolute border-2 rounded-sm border-slate-500 text-xl z-1000 text-slate-800"
            style={{
              left: `${newPos.x}px`,
              top: `${newPos.y}px`,
              width: `${dragData.width}px`,
              height: dragData.height,
            }}
            dangerouslySetInnerHTML={{ __html: dragData.value }}
          />
        )}
      </div>

      <div className="p-4 flex gap-2 flex-col">
        <CopyToClipboard parentRef={ref} />
        <DownloadAsImage parentRef={ref} />
      </div>
    </div>
  );
}
