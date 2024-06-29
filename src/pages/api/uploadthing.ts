import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "@/server/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingSecret: import.meta.env.UPLOADTHING_SECRET,
  },
});
