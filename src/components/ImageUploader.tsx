import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";

export function ImageUploader() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Files: ", res);
        toast.success("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
}
