import { flip, inline, offset, shift, autoPlacement, arrow, hide } from "@floating-ui/dom";

export const buildConfigFromModifiers = (modifiers) => {

  const config = {
    placement: "bottom",
    middleware: [],
  };

  const keys = Object.keys(modifiers);

  const getModifierArgument = (modifier) => {
    return modifiers[modifier];
  };

  if (keys.includes("offset")) {
    config.middleware.push(offset(getModifierArgument("offset")));
  }

  if (keys.includes("placement")) {
    config.placement = getModifierArgument("placement");
  }

  if (keys.includes("autoPlacement") && !keys.includes('flip')) {
    config.middleware.push(autoPlacement(getModifierArgument("autoPlacement")));
  }

  if (keys.includes("flip")) {
    config.middleware.push(flip(getModifierArgument("flip")));
  }

  if (keys.includes("shift")) {
    config.middleware.push(shift(getModifierArgument("shift")));
  }

  if (keys.includes("inline")) {
    config.middleware.push(inline(getModifierArgument("inline")));
  }

  if (keys.includes("arrow")) {
    config.middleware.push(arrow(getModifierArgument("arrow")));
  }

  if (keys.includes("hide")) {
    config.middleware.push(hide(getModifierArgument("hide")));
  }

  return config;
};
