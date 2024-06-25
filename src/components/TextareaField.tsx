import TextEditorMenuBar from "@/components/TextEditorMenuBar";
import { MoveIcon } from "@radix-ui/react-icons";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

type Size = {
  width: number;
  height: number;
};

interface Props {
  idx: number;
  field: Field;
  hidden: boolean;
  onRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onChange: (value: string) => void;
  onSizeChange: (data: Size) => void;
  onDrag: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
}

export default function TextareaField(props: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState<Size>({ width: 200, height: 50 });
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      StarterKit.configure(),
      Placeholder.configure({ placeholder: "Text..." }),
      Underline.configure(),
    ],
    content: props.field.value,
    onUpdate: ({ editor }) => {
      props.onChange(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      editor.commands.focus();
    },
  });

  const { height: toolbarHeight } = useResizeObserver({
    ref: toolbarRef as React.RefObject<HTMLDivElement>,
    box: "border-box",
  });

  const onDebounceResize = useDebounceCallback(
    useCallback(
      (size: Size | Partial<Size>) => {
        props.onSizeChange({ width: size.width ?? 0, height: size.height ?? 0 });
      },
      [props.onSizeChange, toolbarHeight]
    ),
    200
  );

  const onResize = useCallback((size: Size | Partial<Size>) => {
    setSize({ width: size.width ?? 0, height: size.height ?? 0 });
  }, []);

  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    box: "border-box",
    onResize: (size) => {
      onResize(size);
      onDebounceResize(size);
    },
  });

  useEffect(() => {
    props.onRef(ref);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute group"
      style={{
        left: `${props.field.x}px`,
        top: `${props.field.y}px`,
        width: `${width}px`,
        height: height + (toolbarHeight ?? 0),
        opacity: props.hidden ? 0 : 1,
      }}
    >
      <div
        ref={ref}
        className="absolute border-2 border-transparent bg-transparent outline-none text-xl group-focus-within:resize flex flex-col flex-grow overflow-auto min-w-32 min-h-8 group-focus-within:border-zinc-600 rounded-t-sm border-b-0 pb-10 text-slate-800"
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          width: `${width}px`,
          height: height,
        }}
      >
        <div className="h-full">
          <EditorContent editor={editor} className="h-full *:h-full *:outline-none" />
        </div>
      </div>

      <div
        ref={toolbarRef}
        className="absolute bottom-0 left-0 min-w-auto overflow-hidden group-focus-within:block w-full rounded-b-sm hidden"
      >
        <div className="bg-slate-600 overflow-hidden">
          <TextEditorMenuBar editor={editor} onDrag={props.onDrag} onDelete={props.onDelete} />
        </div>
      </div>
    </div>
  );
}
