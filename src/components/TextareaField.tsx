import TextEditorMenuBar, { extensions } from "@/components/TextEditorMenuBar";
import { MoveIcon } from "@radix-ui/react-icons";
import { EditorContent, useEditor } from "@tiptap/react";
import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

interface Props {
  idx: number;
  field: Field;
  ref: React.RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
  onSizeChange: (data: { width: number; height: number }) => void;
}

export default function TextareaField({ idx, field, ref, onChange, onSizeChange }: Props) {
  const editor = useEditor({
    extensions,
    content: field.value,
  });

  useResizeObserver({
    ref,
    box: "border-box",
    onResize: (size) => {
      onSizeChange({ width: size.width || field.width, height: size.height || field.height });
    },
  });

  return (
    <div
      key={field.id}
      ref={ref}
      className="absolute border border-zinc-400 text-slate-800 bg-transparent outline-none rounded-sm italic text-xl resize overflow-auto flex flex-col flex-grow "
      onDoubleClick={(e) => e.stopPropagation()}
      style={{
        left: `${field.x}px`,
        top: `${field.y}px`,
        width: `${field.width}px`,
        height: field.height,
      }}
    >
      <div className="h-full *:h-full">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <MoveIcon
        width="20"
        height="20"
        className="absolute top-0 right-0 text-zinc-600"
        data-field-idx={idx}
      />
      {/* <TextEditorMenuBar editor={editor} /> */}
    </div>
  );
}
