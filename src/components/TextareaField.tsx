import DragButton from "@/components/DragButton";
import { FontSize } from "@/components/text-editor/font-size";
import TextEditorMenuBar from "@/components/text-editor/TextEditorMenuBar";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils";
import { CaretDownIcon } from "@radix-ui/react-icons";
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
  isDragged: boolean;
  onRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onChange: (data: Partial<Field>) => void;
  onDrag: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  StarterKit.configure(),
  Placeholder.configure({ placeholder: "text" }),
  Underline.configure(),
  FontSize.configure(),
];

export default function TextareaField(props: Props) {
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [fontSize, setFontSize] = useState(FONT_HEIGHT);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState<Size>({ width: 200, height: 30 });
  const editor = useEditor({
    content: props.field.value,
    extensions,
    onUpdate: ({ editor }) => {
      props.onChange({ value: editor.getHTML() });
      const lineCount = editor.getJSON().content?.length ?? 1;
      setLineCount(lineCount);
      setSize({ width, height: lineCount * fontSize });
    },
    onCreate: ({ editor }) => {
      editor.commands.focus();
      setFocused(true);
    },
    onFocus: () => {
      setFocused(true);
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

  useEffect(() => {
    if (!props.isDragged && dragging && !focused) {
      setFocused(true);
      setDragging(false);
    }
  });

  return (
    <div
      ref={wrapperRef}
      className="absolute flex flex-col"
      style={{
        left: `${props.field.snapToLine.x ?? props.field.x}px`,
        top: `${props.field.snapToLine.y ?? props.field.y}px`,
        width: `${width}px`,
        opacity: props.isDragged ? 0 : 1,
      }}
    >
      <Popover open={focused}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(
              "field-wrapper border-2 border-transparent bg-transparent outline-none leading-none flex flex-col flex-grow rounded-sm rounded-tr-none text-slate-800 [&::-webkit-resizer]:opacity-0",
              focused && "border-slate-400 resize  overflow-auto",
              dragging && "rounded-tr-sm"
            )}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{
              width: `${width}px`,
              height: height,
              fontSize: `${fontSize}px`,
            }}
          >
            <EditorContent editor={editor} className="h-full" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          className="w-auto px-2"
          onInteractOutside={(e) => {
            if (wrapperRef.current?.contains(e.target as Node)) return;
            setFocused(false);
          }}
          onEscapeKeyDown={() => {
            setFocused(false);
            setDragging(false);
          }}
        >
          <PopoverArrow />
          <TextEditorMenuBar editor={editor} onDelete={props.onDelete} />
        </PopoverContent>
      </Popover>

      <CaretDownIcon
        width="30"
        height="30"
        className={cn(
          "transform -rotate-45 translate-y-[8px] translate-x-[8px] absolute text-slate-400 bottom-0 right-0 hidden z-0 pointer-events-none",
          focused && "block"
        )}
      />

      <DragButton
        className={cn(!focused && "hidden")}
        onMouseDown={(e) => {
          setDragging(true);
          setFocused(false);
          props.onDrag(e);
        }}
      />
    </div>
  );
}
