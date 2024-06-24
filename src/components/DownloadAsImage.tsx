"use client";

import { Button } from "@/components/ui/button";
import { toJpeg } from "html-to-image";
import { toast } from "sonner";

interface Props {
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export default function DownloadAsImage({ parentRef }: Props) {
  return (
    <Button
      onClick={async () => {
        if (!parentRef.current) return;
        const data = await toJpeg(parentRef.current);

        if (!data) {
          toast.error("Couldn't convert to image");
          return;
        }

        const link = document.createElement("a");
        link.download = "подяка.jpg";
        link.href = data;
        link.click();
      }}
    >
      Download
    </Button>
  );
}
