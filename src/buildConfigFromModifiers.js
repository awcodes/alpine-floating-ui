import { flip, inline, offset, shift } from "@floating-ui/dom";

export const buildConfigFromModifiers = (modifiers) => {
  const config = {
    placement: "bottom",
    middleware: [],
  };

  const keys = Object.keys(modifiers);

  const getModifierArgument = (modifier) => {
    return modifiers[modifier];
  };

  if (keys.includes("placement")) {
    config.placement = getModifierArgument("placement");
  }

  if (keys.includes("offset")) {
    config.middleware.push(offset(getModifierArgument("offset")));
  }

  if (keys.includes("flip")) {
    config.middleware.push(flip());
  }

  if (keys.includes("shift")) {
    config.middleware.push(shift());
  }

  if (keys.includes("inline")) {
    config.middleware.push(inline());
  }

  // TODO: add arrow, size, autoPlacement, hide

  return config;
};
