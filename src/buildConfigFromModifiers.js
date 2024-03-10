import { flip, inline, offset, shift, autoPlacement, arrow, size, hide } from "@floating-ui/dom";

export const buildConfigFromModifiers = (modifiers) => {

  const config = {
    placement: "bottom",
    strategy: "absolute",
    middleware: [],
  };

  const keys = Object.keys(modifiers);

  const getModifierArgument = (modifier) => {
    return modifiers[modifier];
  };

  if (keys.includes("offset")) {
    config.middleware.push(offset(getModifierArgument("offset")));
  }

  if (keys.includes("teleport")) {
    config.strategy = "fixed";
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
  
  if (keys.includes("size")) {
    config.middleware.push(size(getModifierArgument("size")));
  }

  return config;
};
