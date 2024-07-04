import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TrashIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { type Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
  onDelete: () => void;
}

export default function TextEditorMenuBar({ editor, onDelete }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center rounded-sm gap-2">
      <div className="flex gap-1 flex-col py-2 overflow-hidden">
        <div className="inline-flex h-6 items-center gap-2">
          <Button size="icon" variant="destructive" onClick={() => onDelete()}>
            <TrashIcon />
          </Button>
          <Input
            type="color"
            className="h-6 w-6 p-0 bg-transparent cursor-pointer hover:bg-slate-800"
            defaultValue={editor.getAttributes("textStyle").color}
            onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
          />
        </div>

        <Separator />

        <div className="inline-flex gap-2 py-1">
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <FontBoldIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <FontItalicIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator />

        <div className="inline-flex gap-2 py-1">
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive("code")}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <CodeIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <TextAlignLeftIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <TextAlignCenterIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <TextAlignJustifyIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <TextAlignRightIcon className="h-4 w-4" />
          </Toggle>
        </div>

        {/* <Toggle
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        Paragraph
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        H4
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        H5
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        H6
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        Bullet list
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        Ordered list
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        Code block
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        Blockquote
      </Toggle>
      <Toggle onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Horizontal rule
      </Toggle>
      <Toggle onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</Toggle>
      <Toggle
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        Undo
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        Redo
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""}
      >
        Purple
      </Toggle> */}
      </div>
    </div>
  );
}
