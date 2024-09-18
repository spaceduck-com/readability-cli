import { inspect } from "node:util";
import { Readability } from "@mozilla/readability";
import type { JSDOM } from "jsdom";
import type { ReadabilityOptions } from "./types";

const logger = (...args: unknown[]) => {
  const formatted = args
    .map((arg) =>
      typeof arg === "string" || arg instanceof String ? arg : inspect(arg),
    )
    .join(" ");
  process.stderr.write(`Reader: (Readability) ${formatted}\n`);
};

export const getReadability = (document: JSDOM, options: ReadabilityOptions) => {
  const reader = new Readability<string>(document.window.document, options);

  if (options.debug) {
    // Overwrite logging to use stderr, as we use stdout for the JSON output.
    // @ts-expect-error
    reader.log = logger;
  }

  return reader;
};
