import { FontSize } from "@/components/text-editor/font-size";
import TextEditorMenuBar from "@/components/text-editor/TextEditorMenuBar";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

const FONT_HEIGHT = 28;

type Size = {
  width: number;
  height: number;
};

interface Props {
  idx: number;
  field: Field;
  hidden: boolean;
  onRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onChange: (data: Partial<Field>) => void;
  onDrag: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
}

export default function TextareaField(props: Props) {
  const [lineCount, setLineCount] = useState(1);
  const [fontSize, setFontSize] = useState(FONT_HEIGHT);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState<Size>({ width: 200, height: 30 });
  const editor = useEditor({
    content: props.field.value,
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      StarterKit.configure(),
      Placeholder.configure({ placeholder: "Text..." }),
      Underline.configure(),
      FontSize.configure(),
    ],
    onUpdate: ({ editor }) => {
      props.onChange({ value: editor.getHTML() });
      const lineCount = editor.getJSON().content?.length ?? 1;
      setLineCount(lineCount);
      setSize({ width, height: lineCount * fontSize });
    },
    onCreate: ({ editor }) => {
      editor.commands.focus();
    },
  });

  const onDebounceResize = useDebounceCallback((data: Partial<Field>) => props.onChange(data), 200);
  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    box: "border-box",
    onResize: (size) => {
      const fontSize = (size.height || 0) / lineCount;
      const newSize = { width: size.width ?? 0, height: size.height ?? 0 };
      setFontSize(fontSize);
      setSize(newSize);
      onDebounceResize({ fontSize, ...newSize });
    },
  });

  useEffect(() => {
    props.onRef(ref);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute group flex flex-col"
      style={{
        left: `${props.field.x}px`,
        top: `${props.field.y}px`,
        width: `${width}px`,
        opacity: props.hidden ? 0 : 1,
      }}
    >
      <div
        ref={ref}
        className="field-wrapper border-2 border-transparent bg-transparent outline-none leading-none overflow-auto group-focus-within:resize flex flex-col flex-grow min-w-32 min-h-8 group-focus-within:border-zinc-600 rounded-t-sm border-b-0 text-slate-800"
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          width: `${width}px`,
          height: height,
          fontSize: `${fontSize}px`,
        }}
      >
        <div className="h-full">
          <EditorContent editor={editor} className="h-full *:h-full *:outline-none" />
        </div>
      </div>

      <div className="min-w-auto overflow-hidden group-focus-within:block w-full rounded-b-sm hidden">
        <div className="bg-slate-600 overflow-hidden">
          <TextEditorMenuBar editor={editor} onDrag={props.onDrag} onDelete={props.onDelete} />
        </div>
      </div>
    </div>
  );
}
