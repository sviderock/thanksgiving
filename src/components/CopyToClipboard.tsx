"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn, onCloneNode } from "@/utils";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { domToBlob } from "modern-screenshot";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export default function CopyToClipboard({ parentRef }: Props) {
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <Button
      className={cn("gap-2", copied && "text-success-500")}
      onClick={async () => {
        if (!parentRef.current) return;
        setPending(true);

        const data = await domToBlob(parentRef.current, { onCloneNode });
        if (!data) {
          toast.error("Couldn't convert to image");
          return;
        }

        try {
          navigator.clipboard.write([new ClipboardItem({ "image/png": data })]);
          toast.success(
            <div className="flex gap-1 flex-col">
              <p>Image copied to clipboard!</p>
              <p>Press Ctrl+V to insert anywhere</p>
            </div>
          );
          setCopied(true);
          return;
        } catch (error) {
          console.error(error);
        } finally {
          setPending(false);
          setTimeout(() => setCopied(false), 3000);
        }
      }}
    >
      <span className="w-4 h-4 flex items-center">
        {pending ? <Spinner /> : <ClipboardCopyIcon />}
      </span>

      {copied ? "Copied!" : "Copy to clipboard"}
    </Button>
  );
}
