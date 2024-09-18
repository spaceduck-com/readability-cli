import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";

export const sanitizeHtml = (content: string) => {
  const window = new JSDOM("").window;
  const purify = createDomPurify(window);
  if (!purify.isSupported) {
    throw new Error("DOMPurify is not supported in the current configuration");
  }
  return purify.sanitize(content);
};
