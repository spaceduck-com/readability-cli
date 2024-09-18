import type { Readability } from "@mozilla/readability";
import { ArgumentParser } from "argparse";
import type { Options } from "./types";

export type ReadabilityOptions = NonNullable<
  ConstructorParameters<typeof Readability<string>>[1]
>;

const addCliOptionsGroup = (parser: ArgumentParser) => {
  const cliOptions = parser.add_argument_group({
    title: "CLI",
    description: "Options for wrapper features and data loading",
  });
  cliOptions.add_argument("path", {
    metavar: "PATH",
    help: "Path of HTML content to read. Use `-` for stdin.",
  });
  cliOptions.add_argument("-o", "--out", {
    default: "-",
    help: "Path to write result JSON to. Use `-` for stdout",
  });
  cliOptions.add_argument("-e", "--encoding", {
    default: undefined,
    dest: "encoding",
    choices: [
      "ascii",
      "utf8",
      "utf-8",
      "utf16le",
      "utf-16le",
      "ucs2",
      "ucs-2",
      "base64",
      "base64url",
      "latin1",
      "binary",
      "hex",
    ],
    help: "Text encoding to use when reading in original HTML",
  });
  const sanitizeGroup = cliOptions.add_mutually_exclusive_group();
  sanitizeGroup.add_argument("-s", "--sanitize", {
    action: "store_true",
    default: false,
    help: "Enable output sanitization using DOMPurify",
  });
  sanitizeGroup.add_argument("-S", "--no-sanitize", {
    action: "store_false",
    dest: "sanitize",
    help: "Disable output sanitization using DOMPurify",
  });

  const failOnEmptyGroup = cliOptions.add_mutually_exclusive_group();
  failOnEmptyGroup.add_argument("-f", "--fail-on-empty", {
    action: "store_true",
    default: false,
    dest: "failOnEmpty",
    help: "Exit with non-zero exit code if no readable content could be generated.",
  });
  failOnEmptyGroup.add_argument("-F", "--no-fail-on-empty", {
    action: "store_false",
    dest: "failOnEmpty",
    help: "Exit with zero exit code, even if no readable content could be generated. The output object will be `null`.",
  });
};

const addReadabilityOptions = (parser: ArgumentParser) => {
  const readabilityOptions = parser.add_argument_group({
    title: "Readability",
    description:
      "Options for @mozilla/readability. See https://github.com/mozilla/readability for more details.",
  });

  const debugGroup = readabilityOptions.add_mutually_exclusive_group();
  debugGroup.add_argument("-d", "--debug", {
    action: "store_true",
    default: false,
    help: "Enable debug logging. Logs will be sent to stderr.`",
  });
  debugGroup.add_argument("-D", "--no-debug", {
    action: "store_false",
    dest: "debug",
    help: "Disable debug logging.",
  });

  readabilityOptions.add_argument("-m", "--max-elements-to-parse", {
    type: "int",
    default: 0,
    dest: "maxElementsToParse",
    metavar: "MAX",
    help: "The maximum number of elements to parse. 0 will disable the limit.",
  });
  readabilityOptions.add_argument("-n", "--nb-top-candidates", {
    type: "int",
    default: 5,
    dest: "nbTopCandidates",
    metavar: "CANDIDATES",
    help: " The number of top candidates to consider when analysing how tight the competition is among candidates.",
  });
  readabilityOptions.add_argument("-c", "--char-threshold", {
    type: "int",
    default: 500,
    dest: "charThreshold",
    metavar: "THRESHOLD",
    help: "The number of characters an article must have in order to return a result.",
  });

  const keepClassesGroup = readabilityOptions.add_mutually_exclusive_group();
  keepClassesGroup.add_argument("-k", "--keep-classes", {
    action: "store_true",
    default: false,
    dest: "keepClasses",
    help: "Keep all classes on HTML elements.",
  });
  keepClassesGroup.add_argument("-K", "--no-keep-classes", {
    action: "store_false",
    dest: "keepClasses",
    help: "Only keep classes listed using --preserve-class. If none are specified, all classes will be removed.",
  });

  readabilityOptions.add_argument("-p", "--preserve-class", {
    action: "append",
    dest: "preserveClasses",
    metavar: "CLASS_NAME",
    help: "When using --no-keep-classes, the given classes will still be kept.",
  });

  const jsonLdGroup = readabilityOptions.add_mutually_exclusive_group();
  jsonLdGroup.add_argument("-j", "--json-ld", {
    action: "store_false",
    default: false,
    dest: "disableJSONLD",
    help: "Extract and use metadata from json-ld metadata when possible.",
  });
  jsonLdGroup.add_argument("-J", "--no-json-ld", {
    action: "store_true",
    dest: "disableJSONLD",
    help: "Do not attempt load json-ld metadata, even if it is available.",
  });

  readabilityOptions.add_argument("-v", "--allowed-video-regex", {
    default: undefined,
    dest: "allowedVideoRegex",
    metavar: "REGEX",
    help: "Regular expression that matches video URLs that should be allowed to be included in the article content.",
  });
  readabilityOptions.add_argument("-l", "--link-density-modifier", {
    type: "int",
    default: 0,
    dest: "linkDensityModifier",
    metavar: "MODIFIER",
    help: "Number that is added to the base link density threshold during the shadiness checks. This can be used to penalize nodes with a high link density or vice versa.",
  });
};

const addDomOptions = (parser: ArgumentParser) => {
  const domOptions = parser.add_argument_group({
    title: "JSDom",
    description:
      "Options for JSDom. See https://github.com/jsdom/jsdom for more details.",
  });

  domOptions.add_argument("-u", "--url", {
    help: "Original URL the HTML content was fetched from. Used to resolve relative URLs.",
  });
  domOptions.add_argument("-C", "--content-type", {
    default: "text/html",
    dest: "contentType",
    metavar: "MEDIA_TYPE",
    help: "Media type (from `Content-Type` header) of the original HTML.",
  });
};

const getParser = () => {
  const parser = new ArgumentParser();
  addCliOptionsGroup(parser);
  addReadabilityOptions(parser);
  addDomOptions(parser);
  return parser;
};

export const parseArgs = (): Options => {
  const {
    url,
    contentType,
    path,
    out,
    encoding,
    failOnEmpty,
    allowedVideoRegex,
    sanitize,
    ...options
  } = getParser().parse_args();
  const cli = { path, out, encoding, failOnEmpty, sanitize };
  const dom = { url, contentType };
  const readability = {
    ...options,
    allowedVideoRegex:
      allowedVideoRegex === undefined ? undefined : new RegExp(allowedVideoRegex),
  };

  return { cli, dom, readability };
};
