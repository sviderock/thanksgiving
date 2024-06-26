declare global {
  type Field = {
    id: string;
    value: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    dragOffsetX: number;
    dragOffsetY: number;
  };
}

export {};
