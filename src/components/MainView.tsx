"use client";

import "core-js/actual/array/with";
import CopyToClipboard from "@/components/CopyToClipboard";
import DownloadAsImage from "@/components/DownloadAsImage";
import DragButton from "@/components/DragButton";
import TextareaField from "@/components/TextareaField";
import { Button } from "@/components/ui/button";
import { detectDoubleTap } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

function isDoubleTap(e: unknown): e is CustomEvent {
  return (e as CustomEvent)?.type === "doubletap";
}

export default function MainView() {
  const [fields, setFields] = useState<Field[]>([]);
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
    setFields((fields) => [
      ...fields,
      {
        id: uuidv4(),
        value: "",
        x,
        y,
        width: 200,
        height: 30,
        fontSize: 28,
        dragOffsetX: 0,
        dragOffsetY: 0,
      },
    ]);
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
          setNewPos({
            x: e.nativeEvent.x - rect.left - dragData!.dragOffsetX,
            y: e.nativeEvent.y - rect.top - dragData!.dragOffsetY,
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
        <img className="md:h-lvh w-lvw md:w-auto select-none" src="/podyaka_1.jpg" />

        {fields.map((field, idx) => (
          <TextareaField
            key={field.id}
            idx={idx}
            field={field}
            isDragged={`${idx}` === draggingIdx}
            onRef={(ref) => {
              fieldRefs.current[idx] = ref.current;
            }}
            onDelete={() => {
              setFields((fields) => fields.filter((item) => field.id !== item.id));
            }}
            onChange={(data) => {
              setFields((fields) => fields.with(idx, { ...field, ...data }));
            }}
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
              setFields((fields) => fields.with(idx, { ...field, dragOffsetX, dragOffsetY }));
              setNewPos({ x, y });
            }}
          />
        ))}

        {dragData && (
          <div
            className="absolute border-2 leading-none rounded-sm border-slate-500 text-xl z-1000 text-slate-800 break-words rounded-tr-none"
            style={{
              left: `${newPos.x}px`,
              top: `${newPos.y}px`,
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

      <div className="p-4 flex gap-2 flex-col">
        <CopyToClipboard parentRef={ref} />
        <DownloadAsImage parentRef={ref} />
        <Button
          onClick={() => {
            if (!fields.length) {
              toast.info("It's empty");
              return;
            }

            try {
              const dataFromLS = localStorage.getItem("saved");
              if (!dataFromLS) {
                localStorage.setItem("saved", JSON.stringify([fields]));
                toast.success("Saved to local storage");
                return;
              }

              const data = JSON.parse(dataFromLS) as Array<Field[]>;
              data.push(fields);
              localStorage.setItem("saved", JSON.stringify(data));
              toast.success("Saved to local storage");
            } catch (error) {}
          }}
        >
          Save to local storage
        </Button>
        <Button
          onClick={() => {
            try {
              const dataFromLS = localStorage.getItem("saved");
              if (!dataFromLS) throw Error("nope");
              const data = JSON.parse(dataFromLS);
              setFields(data.at(-1));
            } catch (error) {
              toast.error("An error occured while parsing local storage");
            }
          }}
        >
          Restore last from local storage
        </Button>
      </div>
    </div>
  );
}
