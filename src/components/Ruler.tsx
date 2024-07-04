import { cn } from "@/utils";
import { useStore } from "@/utils/state";
import { useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

const LINE_WIDTH = 2;

type Line = {
  x: number;
  y: number;
  orientation: "vertical" | "horizontal";
};

export default function Ruler() {
  const { lines, setLines, updateLinePos } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [newPos, setNewPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const dragData = draggingIdx ? lines[draggingIdx] : null;

  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    box: "border-box",
    onResize: ({ height, width }) => {
      if (height === undefined || width === undefined) return;
      setLines([
        { x: 0, y: 0, orientation: "horizontal" },
        { x: 0, y: height / 2 - LINE_WIDTH / 2, orientation: "horizontal" },
        { x: 0, y: height - LINE_WIDTH, orientation: "horizontal" },
        { x: 0, y: 0, orientation: "vertical" },
        { x: width - LINE_WIDTH / 2, y: 0, orientation: "vertical" },
        { x: width / 4 - LINE_WIDTH / 2, y: 0, orientation: "vertical" },
        { x: width / 2 - LINE_WIDTH / 2, y: 0, orientation: "vertical" },
        { x: width / 2 + width / 4 - LINE_WIDTH / 2, y: 0, orientation: "vertical" },
        { x: width - LINE_WIDTH, y: 0, orientation: "vertical" },
      ]);
    },
  });

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 right-0 bottom-0"
      onMouseMove={(e) => {
        if (!dragData) return;
        setNewPos((pos) => ({
          x: dragData.orientation === "horizontal" ? pos.x : e.clientX,
          y: dragData.orientation === "horizontal" ? e.clientY : pos.y,
        }));
      }}
    >
      {lines.map((line, idx) => (
        <Line
          key={idx}
          line={line}
          hidden={draggingIdx === idx}
          onMouseDown={() => {
            setDraggingIdx(idx);
            setNewPos({ x: line.x, y: line.y });
          }}
        />
      ))}

      {dragData && (
        <Line
          line={{ ...dragData, x: newPos.x, y: newPos.y }}
          onMouseUp={() => {
            if (!draggingIdx) return;
            setDraggingIdx(null);
            setNewPos({ x: 0, y: 0 });
            updateLinePos(draggingIdx, newPos);
          }}
        />
      )}
    </div>
  );
}

type LineProps = React.HTMLAttributes<HTMLSpanElement> & {
  line: Line;
};

function Line({ line, hidden, className, style, ...props }: LineProps) {
  return (
    <span
      {...props}
      className={cn("absolute border border-dashed border-blue-500 hover:bg-blue-500", className)}
      style={{
        top: `${line.y}px`,
        left: `${line.x}px`,
        width: line.orientation === "horizontal" ? "100%" : LINE_WIDTH,
        height: line.orientation === "vertical" ? "100%" : LINE_WIDTH,
        cursor: line.orientation === "horizontal" ? "row-resize" : "col-resize",
        display: hidden ? "none" : "block",
        ...style,
      }}
    />
  );
}
