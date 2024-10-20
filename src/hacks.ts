// @ts-ignore
import validateNames from "jsdom/lib/jsdom/living/helpers/validate-names.js";

const applyJSDOMInvalidARgumentHack = () => {
  // See: https://github.com/mozilla/readability/pull/918
  const originalNameValidator = validateNames.name;
  // @ts-expect-error
  validateNames.name = (...args) => {
    try {
      originalNameValidator(...args);
    } catch (ex) {
      // @ts-expect-error
      if (ex?.name !== "InvalidCharacterError") {
        throw ex;
      }
    }
  };
};

export const applyHacks = () => {
  applyJSDOMInvalidARgumentHack();
};
