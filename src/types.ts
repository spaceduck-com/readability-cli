import type { Readability } from "@mozilla/readability";

import type { ConstructorOptions } from "jsdom";

export type CliOptions = {
  path: string;
  out: string;
  encoding: BufferEncoding;
  sanitize: boolean;
  failOnEmpty: boolean;
};
export type DomOptions = ConstructorOptions;
export type ReadabilityOptions = NonNullable<
  ConstructorParameters<typeof Readability<string>>[1]
>;
export type Options = {
  cli: CliOptions;
  dom: DomOptions;
  readability: ReadabilityOptions;
};
