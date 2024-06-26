import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/utils";
import { MoveIcon } from "@radix-ui/react-icons";

export default function DragButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      size="iconSmall"
      variant="dragIcon"
      className={cn("flex absolute bottom-full right-0 cursor-move", className)}
    >
      <MoveIcon />
    </Button>
  );
}
