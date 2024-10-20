import { JSDOM } from "jsdom";
import { parseArgs } from "./cli";
import { applyHacks } from "./hacks";
import { readData, writeData } from "./io";
import { getReadability } from "./readability";
import { sanitizeHtml } from "./sanitize";
import type { Options } from "./types";

const getResult = async (data: string | Buffer, options: Options) => {
  const document = new JSDOM(data, options.dom);
  const reader = getReadability(document, options.readability);
  const result = reader.parse();

  if (result === null) {
    return result;
  }

  return options.cli.sanitize
    ? { ...result, content: sanitizeHtml(result.content ?? "") }
    : result;
};

const main = async () => {
  applyHacks();
  const options = parseArgs();
  const data = await readData(options.cli.path, options.cli.encoding);
  const result = await getResult(data, options);
  await writeData(options.cli.out, `${JSON.stringify(result)}\n`);
};

void main().catch((reason) => {
  console.error("FATAL", reason);
  process.exit(2);
});
