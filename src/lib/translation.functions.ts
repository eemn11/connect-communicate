import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const translate = createServerFn({ method: "POST" })
  .inputValidator(z.object({ text: z.string().trim().min(1).max(4000), target: z.enum(["en", "ko"]) }))
  .handler(async ({ data }) => {
    try {
      const { translateText } = await import("./ai/translation.server");
      return { translation: await translateText(data.text, data.target), error: "" };
    } catch (error) {
      // Do not serialize provider request bodies (which contain private input).
      let message = "Couldn't translate right now. Your text is kept; please try again.";
      if (error && typeof error === "object" && "responseBody" in error && typeof error.responseBody === "string") {
        try { const body = JSON.parse(error.responseBody); message = body.error?.message || body.message || message; } catch { /* keep safe fallback */ }
      }
      return { translation: "", error: message };
    }
  });