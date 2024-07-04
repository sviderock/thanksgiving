import CopyToClipboard from "@/components/CopyToClipboard";
import DownloadAsImage from "@/components/DownloadAsImage";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useStore } from "@/utils/state";
import { toast } from "sonner";

interface Props {
  parentRef: React.RefObject<HTMLDivElement | null>;
  fields: Field[];
  onRestore: (data: Field[]) => void;
}

export default function Actions({ parentRef, fields, onRestore }: Props) {
  const { toggleRuler } = useStore();
  return (
    <div className="p-4 flex gap-2 flex-col">
      <ImageUploader />
      <CopyToClipboard parentRef={parentRef} />
      <DownloadAsImage parentRef={parentRef} />
      <Button
        onClick={() => {
          if (!fields.length) {
            toast.info("It's empty");
            return;
          }

          try {
            const dataFromLS = localStorage.getItem("saved");
            if (!dataFromLS) {
              localStorage.setItem("saved", JSON.stringify([fields]));
              toast.success("Saved to local storage");
              return;
            }

            const data = JSON.parse(dataFromLS) as Array<Field[]>;
            data.push(fields);
            localStorage.setItem("saved", JSON.stringify(data));
            toast.success("Saved to local storage");
          } catch (error) {}
        }}
      >
        Save to local storage
      </Button>
      <Button
        onClick={() => {
          try {
            const dataFromLS = localStorage.getItem("saved");
            if (!dataFromLS) throw Error("nope");
            const data = JSON.parse(dataFromLS);
            onRestore(data.at(-1));
          } catch (error) {
            toast.error("An error occured while parsing local storage");
          }
        }}
      >
        Restore last from local storage
      </Button>
      <Button onClick={toggleRuler}>Toggle Ruler</Button>
    </div>
  );
}
