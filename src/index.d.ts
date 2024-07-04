declare global {
  type Field = {
    id: string;
    value: string;
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    fontSize: number;
    dragOffsetX: number;
    dragOffsetY: number;
    snapToLine: {
      x: number | null;
      y: number | null;
    };
  };

  type RulerLine = {
    x: number;
    y: number;
    orientation: "vertical" | "horizontal";
  };
}

export {};
